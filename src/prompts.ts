export const prompts = (htmlContent: string) => `
Analyze the provided HTML, CSS, and JavaScript code for a website and provide a comprehensive evaluation based on the following criteria. Use a scale of 1-5 for each criterion, where 1 is poor and 5 is excellent. Provide a brief explanation for each score and suggest improvements where applicable.
HTML Evaluation (Score: /25)
Structure and semantics (/5)
Accessibility (/5)
Best practices (/5)
Compatibility (/5)
SEO optimization (/5)
CSS Evaluation (Score: /25)
Code quality and organization (/5)
Responsiveness (/5)
Browser compatibility (/5)
Performance optimization (/5)
Modern practices (/5)
JavaScript Evaluation (Score: /25)
Code quality and readability (/5)
Performance and optimization (/5)
Modern practices and ES6+ features (/5)
Error handling and debugging (/5)
Integration with HTML/CSS (/5)
Overall Evaluation (Score: /25)
Code organization and structure (/5)
Documentation and comments (/5)
Consistency across files (/5)
Use of version control (if applicable) (/5)
Overall best practices (/5)
Total Score: /100
Please provide a summary of the evaluation, highlighting the main strengths and areas for improvement. Include specific recommendations for enhancing the code quality, performance, and user experience of the website.
add the original code and it's corresponding recommended code
return as a json obj and make sure it can be JSON.parse but don't prepend it with json
`;
// ${htmlContent}
// htmlContent: string
export const prompts1 = () => `
You are an expert code reviewer. I will provide chunks of a webpage's HTML content. Remember each chunk, analyze them,
Evaluate the HTML, CSS, and JavaScript code using a 1-5 scale (1 = poor, 5 = excellent). Provide explanations and suggestions where needed.

### HTML (Score: /25)
- Structure and semantics (/5)
- Accessibility (/5)
- Best practices (/5)
- Compatibility (/5)
- SEO optimization (/5)

### CSS (Score: /25)
- Code quality (/5)
- Responsiveness (/5)
- Browser compatibility (/5)
- Performance (/5)
- Modern practices (/5)

### JavaScript (Score: /25)
- Code quality (/5)
- Performance (/5)
- Modern practices (/5)
- Error handling (/5)
- Integration with HTML/CSS (/5)

### Overall (Score: /25)
- Organization (/5)
- Documentation (/5)
- Consistency (/5)
- Version control (/5)
- Best practices (/5)

### Total: /100

Ensure the JSON object has a valid structure:
- Include scores, explanations, and improvements for each category.
- Provide both the original and recommended code for each section. THIS IS VERY IMPORTANT.
- Use commas to separate key-value pairs and arrays correctly.
Return the result **only** as a plain JSON object without any prefixes, markdown formatting (e.g., no backticks or \`\`\`json), or extra text. The output should be clean and ready to be parsed directly using \`JSON.parse()\`.
`;
// ${htmlContent}

export const htmlContentOnly = (htmlContent: string) => `${htmlContent}`;
export const finalReportPrompt =
  () => `Now, based on all the provided chunks, generate a final consolidated report Return the result **only** as a plain JSON object without any prefixes, markdown formatting (e.g., no backticks or \`\`\`json), or extra text. The output should be clean and ready to be parsed directly using \`JSON.parse()
`;
