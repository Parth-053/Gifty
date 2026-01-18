import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize"; 
import xss from "xss-clean"; 

/**
 * Combined Security Middleware
 * Applies multiple security layers in one go.
 */
export const securityMiddleware = (app) => {
  // 1. Set Secure HTTP Headers (Helmet)
  app.use(helmet());

  // 2. Data Sanitization against NoSQL Query Injection
  // (Hacker cannot use operators like $gt, $lte in inputs)
  app.use(mongoSanitize());

  // 3. Data Sanitization against XSS
  // (Converts HTML symbols to entities to prevent malicious scripts)
  app.use(xss());

  // 4. Custom: Block specific permission policies 
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    next();
  });
};

export const sanitizeInputs = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      } else if (key.includes("$")) {
        delete obj[key]; // Dangerous Key Found!
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  
  next();
};