/**
 * Input sanitization & prompt injection prevention for library AI
 */
export class SecuritySanitizer {
  /**
   * Cleans user query of dangerous escape sequences, potential prompt injections,
   * or adversarial override attempts.
   */
  static sanitizeQuery(input: string): string {
    if (!input || typeof input !== 'string') return '';

    // Trim and limit length to reasonable academic query length (max 1000 chars)
    let sanitized = input.trim().slice(0, 1000);

    // Strip common prompt injection patterns
    const injectionPatterns = [
      /ignore\s+(all\s+)?(previous|prior)\s+instructions/gi,
      /you\s+are\s+now\s+in\s+developer\s+mode/gi,
      /system\s*:\s*you\s+must/gi,
      /<system>/gi,
      /<\/system>/gi,
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi
    ];

    for (const pattern of injectionPatterns) {
      sanitized = sanitized.replace(pattern, '[filtered]');
    }

    return sanitized;
  }

  /**
   * Sanitizes external bibliographic text from Open Library before rendering in HTML
   * or passing into AI context.
   */
  static sanitizeExternalText(text: string): string {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Validates safe URL protocols to prevent javascript: or data: URIs
   */
  static isValidSafeUrl(url: string): boolean {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
