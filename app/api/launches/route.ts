import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { LaunchSchema, LaunchSubmissionSchema } from '../../launches/types';

const LAUNCHES_FILE_PATH = path.join(process.cwd(), 'public', 'launches.json');

// Enhanced rate limiting - more restrictive for spam prevention
const submitAttempts = new Map<string, { count: number; lastAttempt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_ATTEMPTS_PER_WINDOW = 2; // Reduced to 2 submissions per minute per IP
const GLOBAL_COOLDOWN = 10 * 1000; // 10 seconds between any submissions globally

// Global tracking for additional spam prevention
let lastGlobalSubmission = 0;
const recentSubmissions = new Map<string, number>(); // Track recent identical content

// Pure function to generate unique ID
// Pure function
function generateLaunchId(): string {
  return `launch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Pure function to sanitize and validate string input
// Pure function
function sanitizeString(input: string): string {
  const sanitized = input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .slice(0, 1000); // Limit length
  
  // Quality check - ensure minimum meaningful content
  if (sanitized.length < 10) {
    throw new Error('Content too short - please provide more details');
  }
  
  return sanitized;
}

// Pure function to check for spam patterns
// Pure function
function detectSpamPatterns(title: string, description: string, url: string): boolean {
  const content = `${title} ${description} ${url}`.toLowerCase();
  
  // Check for spam indicators
  const spamPatterns = [
    /click here/gi,
    /limited time/gi,
    /act now/gi,
    /guaranteed/gi,
    /make money/gi,
    /free money/gi,
    /viagra/gi,
    /casino/gi,
    /crypto.*profit/gi,
    /investment.*guaranteed/gi,
  ];
  
  return spamPatterns.some(pattern => pattern.test(content));
}

// Pure function to generate content hash for duplicate detection
// Pure function
function generateContentHash(title: string, description: string, url: string): string {
  const content = `${title.toLowerCase().trim()}|${description.toLowerCase().trim()}|${url.toLowerCase().trim()}`;
  // Simple hash function for duplicate detection
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

// Pure function to create new launch from submission
// Pure function
function createLaunchFromSubmission(submission: z.infer<typeof LaunchSubmissionSchema>): z.infer<typeof LaunchSchema> {
  return {
    id: generateLaunchId(),
    title: sanitizeString(submission.title),
    url: submission.url, // URL validation already done by Zod
    description: sanitizeString(submission.description),
    tags: submission.tags.map(tag => sanitizeString(tag)).filter(tag => tag.length > 0),
    submittedAt: new Date().toISOString(),
  };
}

// Pure function to sort launches by submission date
// Pure function
function sortLaunchesByNewest(launches: z.infer<typeof LaunchSchema>[]): z.infer<typeof LaunchSchema>[] {
  return [...launches].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

// Pure function to check rate limit
// Pure function
function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const attempts = submitAttempts.get(clientId);
  
  if (!attempts) {
    return false;
  }
  
  // Reset if window has passed
  if (now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
    submitAttempts.delete(clientId);
    return false;
  }
  
  return attempts.count >= MAX_ATTEMPTS_PER_WINDOW;
}

// Pure function to check global cooldown
// Pure function
function isGlobalCooldownActive(): boolean {
  return Date.now() - lastGlobalSubmission < GLOBAL_COOLDOWN;
}

// Pure function to check for recent duplicates
// Pure function
function isDuplicateContent(contentHash: string): boolean {
  const now = Date.now();
  const DUPLICATE_WINDOW = 60 * 60 * 1000; // 1 hour window for duplicate detection
  
  const lastSubmission = recentSubmissions.get(contentHash);
  if (lastSubmission && now - lastSubmission < DUPLICATE_WINDOW) {
    return true;
  }
  
  return false;
}

// Pure function to record attempt
// Pure function
function recordAttempt(clientId: string): void {
  const now = Date.now();
  const attempts = submitAttempts.get(clientId);
  
  if (!attempts || now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
    submitAttempts.set(clientId, { count: 1, lastAttempt: now });
  } else {
    submitAttempts.set(clientId, { count: attempts.count + 1, lastAttempt: now });
  }
}

// GET /api/launches - Read all launches
export async function GET() {
  try {
    const fileContents = await fs.readFile(LAUNCHES_FILE_PATH, 'utf8');
    const launches = JSON.parse(fileContents);
    const validatedLaunches = z.array(LaunchSchema).parse(launches);
    const sortedLaunches = sortLaunchesByNewest(validatedLaunches);
    
    return NextResponse.json({
      launches: sortedLaunches,
      total: sortedLaunches.length,
    });
  } catch (error) {
    console.error('Failed to read launches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch launches' },
      { status: 500 }
    );
  }
}

// POST /api/launches - Submit new launch (with enhanced anti-spam measures)
export async function POST(request: NextRequest) {
  try {
    // Security: Check request origin for same-origin requests
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (origin && host) {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return NextResponse.json(
          { error: 'Cross-origin requests not allowed' },
          { status: 403 }
        );
      }
    }
    
    // Anti-spam: Check global cooldown first
    if (isGlobalCooldownActive()) {
      return NextResponse.json(
        { error: 'Please wait a moment before submitting. Server is processing other submissions.' },
        { status: 429 }
      );
    }
    
    // Security: Rate limiting by IP
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. You can submit maximum 2 launches per minute. Please try again later.' },
        { status: 429 }
      );
    }
    
    recordAttempt(clientIp);
    
    // Security: Validate Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Security: Validate the submission with strict schema
    const validatedSubmission = LaunchSubmissionSchema.parse(body);
    
    // Anti-spam: Check for spam patterns
    if (detectSpamPatterns(validatedSubmission.title, validatedSubmission.description, validatedSubmission.url)) {
      console.warn('Spam pattern detected:', { 
        title: validatedSubmission.title, 
        from: clientIp 
      });
      return NextResponse.json(
        { error: 'Content flagged as potential spam. Please ensure your submission is legitimate.' },
        { status: 400 }
      );
    }
    
    // Anti-spam: Check for duplicate content
    const contentHash = generateContentHash(
      validatedSubmission.title, 
      validatedSubmission.description, 
      validatedSubmission.url
    );
    
    if (isDuplicateContent(contentHash)) {
      return NextResponse.json(
        { error: 'This content appears to be a duplicate of a recent submission. Please submit unique launches only.' },
        { status: 409 }
      );
    }
    
    // Security: Additional validation for malicious content
    if (validatedSubmission.title.includes('javascript:') || 
        validatedSubmission.description.includes('javascript:') ||
        validatedSubmission.url.includes('javascript:')) {
      return NextResponse.json(
        { error: 'Invalid content detected' },
        { status: 400 }
      );
    }
    
    // Security: Check file permissions before reading
    try {
      await fs.access(LAUNCHES_FILE_PATH, fs.constants.R_OK | fs.constants.W_OK);
    } catch {
      console.error('File permission check failed');
      return NextResponse.json(
        { error: 'File access denied' },
        { status: 500 }
      );
    }
    
    // Read existing launches
    const fileContents = await fs.readFile(LAUNCHES_FILE_PATH, 'utf8');
    const existingLaunches = JSON.parse(fileContents);
    const validatedExisting = z.array(LaunchSchema).parse(existingLaunches);
    
    // Security: Limit total number of launches to prevent file bloat
    const MAX_LAUNCHES = 1000;
    if (validatedExisting.length >= MAX_LAUNCHES) {
      return NextResponse.json(
        { error: 'Maximum number of launches reached' },
        { status: 507 }
      );
    }
    
    // Create new launch with sanitized content
    const newLaunch = createLaunchFromSubmission(validatedSubmission);
    
    // Add to beginning of array (newest first)
    const updatedLaunches = [newLaunch, ...validatedExisting];
    
    // Security: Atomic write operation
    const tempFilePath = `${LAUNCHES_FILE_PATH}.tmp`;
    await fs.writeFile(tempFilePath, JSON.stringify(updatedLaunches, null, 2));
    await fs.rename(tempFilePath, LAUNCHES_FILE_PATH);
    
    // Update tracking for anti-spam measures
    lastGlobalSubmission = Date.now();
    recentSubmissions.set(contentHash, Date.now());
    
    // Clean up old duplicate tracking entries periodically
    if (recentSubmissions.size > 100) {
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      const hashesToDelete: string[] = [];
      
      recentSubmissions.forEach((timestamp, hash) => {
        if (timestamp < oneHourAgo) {
          hashesToDelete.push(hash);
        }
      });
      
      hashesToDelete.forEach(hash => {
        recentSubmissions.delete(hash);
      });
    }
    
    console.log('New launch added to central file:', {
      id: newLaunch.id,
      title: newLaunch.title,
      from: clientIp
    });
    
    return NextResponse.json(newLaunch, { status: 201 });
  } catch (error) {
    console.error('Failed to submit launch:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes('Content too short')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit launch' },
      { status: 500 }
    );
  }
} 