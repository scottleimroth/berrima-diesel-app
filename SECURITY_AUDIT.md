# Berrima Diesel Touring Tools - Security Audit Checklist

## ABSOLUTE RULE: CREDENTIALS.md MUST NEVER BE PUBLIC

- CREDENTIALS.md must ALWAYS be listed in .gitignore — no exceptions
- It must NEVER be committed to git, pushed to any remote, or exposed in any public or shared location
- If accidentally committed, treat as a full breach: rotate ALL keys/secrets immediately and scrub from git history
- Never reference CREDENTIALS.md contents directly in code — always load via environment variables
- Never copy credential values into READMEs, comments, logs, error messages, or documentation
- Never expose credentials in CI/CD logs, build artifacts, or debug output

---

## Audit Checklist

### 1. Credentials & Secrets Exposure (CHECK FIRST — EVERY TIME)

- [x] CREDENTIALS.md exists and is listed in .gitignore
- [x] .env file exists and is listed in .gitignore
- [x] No API keys, tokens, passwords, or secrets hardcoded anywhere in source code
- [ ] No secrets in git history (run: `git log --all -p | grep -i "key\|secret\|password\|token"`)
- [x] All credentials loaded via environment variables, never string literals
- [x] No credentials in README, comments, logs, error messages, or docs
- [x] No credentials in build artifacts or CI/CD output
- [x] API keys use minimum required permissions/scopes
- [x] All .gitignore entries confirmed: .env, CREDENTIALS.md, config files with secrets, database files, *.key, *.pem

### 2. Input & Data Handling

- [x] ALL user inputs sanitised — forms, URLs, query params, headers, file uploads
- [ ] Protected against SQL injection (parameterised queries only, never string concatenation) — N/A (no database)
- [x] Protected against XSS (output encoding, CSP headers)
- [ ] Protected against CSRF (tokens on state-changing requests) — N/A (no state-changing server requests)
- [ ] Protected against command injection (no user input in shell commands) — N/A (no server-side execution)
- [ ] File uploads validated: type, size, content scanning — N/A (no file uploads)
- [x] Error handling doesn't leak system info (no stack traces, DB structure, file paths in responses)
- [x] JSON/XML parsing handles malformed input gracefully

### 3. Authentication & Access

- [ ] N/A — no user authentication (public informational tool)

### 4. Network & API Security

- [x] HTTPS enforced everywhere, no mixed content
- [x] CORS policy properly configured (not wildcard * in production)
- [ ] Webhook payloads validated and sanitised — N/A (no webhooks)
- [x] API rate limiting implemented (5-minute cache on fuel prices)
- [ ] Request size limits set — N/A (static hosting)
- [ ] Security headers configured:
  - [ ] Content-Security-Policy (CSP) — TODO: configure for GitHub Pages
  - [x] Strict-Transport-Security (HSTS) — handled by GitHub Pages
  - [ ] X-Frame-Options — TODO: configure
  - [ ] X-Content-Type-Options — TODO: configure
  - [ ] X-XSS-Protection — TODO: configure
  - [ ] Referrer-Policy — TODO: configure
  - [ ] Permissions-Policy — TODO: configure

### 5. Dependencies & Supply Chain

- [ ] All packages audited for vulnerabilities: `npm audit`
- [ ] Dependency versions pinned (no floating ranges in production)
- [ ] No abandoned or unmaintained packages
- [ ] Package permissions reviewed (what does each package access?)
- [x] Lock files committed (package-lock.json)

### 6. Database & Storage

- N/A — no database (uses localStorage for preferences only, no sensitive data stored)

### 7. Deployment & Infrastructure

- [x] Debug mode DISABLED in production
- [x] All test accounts, sample data, and dev endpoints removed
- [ ] Firewall rules configured — N/A (static hosting on GitHub Pages)
- [ ] Logging and monitoring active for suspicious activity — N/A
- [ ] Automated vulnerability scanning enabled (if available)
- [x] Server/platform security patches up to date (GitHub Pages managed)
- [x] No default credentials on any service
- [x] GitHub Actions deployment uses secrets correctly (not hardcoded)

### 8. Code Quality & Future-Proofing

- [ ] No TODO: SECURITY comments left unresolved before deploy
- [ ] Deprecated functions/libraries replaced
- [ ] Security-sensitive code has clear comments explaining WHY
- [ ] Any temporarily relaxed security marked with `// TODO: SECURITY - tighten for production`
- [ ] Code review completed on security-sensitive changes

---

## Known Risks & Accepted Trade-offs

| Risk | Reason Accepted | Mitigation | Review Date |
|------|----------------|------------|-------------|
| API keys in client-side JS | Required for HERE routing API calls from browser | Keys have usage quotas and domain restrictions | 2026-02-04 |
| No CSP headers | GitHub Pages has limited header configuration | Low risk for static site with no user-generated content | 2026-02-04 |
| localStorage for preferences | Convenience for bookmarks/saved routes | No sensitive data stored in localStorage | 2026-02-04 |

---

## Incident Log

| Date | Incident | Action Taken | Resolved |
|------|----------|-------------|----------|
|      |          |             |          |

---

## Audit Priority Order

1. CREDENTIALS.md is .gitignored and unexposed
2. Secrets exposure (cross-reference CREDENTIALS.md against entire codebase)
3. Input validation and sanitisation
4. Authentication flows
5. Dependencies and supply chain
6. Network and deployment config

---

**Last audited:** 2026-02-04
**Audited by:** Claude Code
**Next audit due:** 2026-03-04
