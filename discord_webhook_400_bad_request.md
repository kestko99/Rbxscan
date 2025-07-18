# Discord Webhook 400 Bad Request Error Guide

## What is HTTP 400 Bad Request?

HTTP 400 Bad Request is a client error status code that indicates the server cannot or will not process the request due to something that is perceived to be a client error. In the context of Discord webhooks, this means your webhook request is malformed or contains invalid data that Discord's servers cannot understand or process.

## Common Causes of 400 Bad Request in Discord Webhooks

### 1. **Invalid JSON Structure**
The most common cause is malformed JSON in your webhook payload.

**❌ Bad:**
```json
{
  "content": "Hello World"
  "username": "Bot"  // Missing comma
}
```

**✅ Good:**
```json
{
  "content": "Hello World",
  "username": "Bot"
}
```

### 2. **Missing Required Fields**
Discord webhooks require at least one of: `content`, `embeds`, `poll`, or file attachments.

**❌ Bad:**
```json
{
  "username": "Bot",
  "avatar_url": "https://example.com/avatar.png"
}
```

**✅ Good:**
```json
{
  "content": "Hello World",
  "username": "Bot",
  "avatar_url": "https://example.com/avatar.png"
}
```

### 3. **Field Length Limits Exceeded**

| Field | Limit |
|-------|-------|
| `content` | 2000 characters |
| `username` | 1-80 characters |
| `embeds` | 10 embed objects max |
| `embeds[].title` | 256 characters |
| `embeds[].description` | 4096 characters |
| `embeds[].fields` | 25 field objects max |
| `embeds[].fields[].name` | 256 characters |
| `embeds[].fields[].value` | 1024 characters |
| `embeds[].footer.text` | 2048 characters |
| `embeds[].author.name` | 256 characters |
| Total embed characters | 6000 characters |

### 4. **Invalid Data Types**
Using wrong data types for specific fields.

**❌ Bad:**
```json
{
  "content": "Hello",
  "embeds": [{
    "color": "#FF0000",  // Should be decimal, not hex
    "timestamp": "2023-01-01"  // Should be ISO8601 format
  }]
}
```

**✅ Good:**
```json
{
  "content": "Hello",
  "embeds": [{
    "color": 16711680,  // Decimal color code
    "timestamp": "2023-01-01T12:00:00.000Z"  // ISO8601 format
  }]
}
```

### 5. **Invalid URLs**
URLs in fields like `avatar_url`, `embeds[].image.url`, etc. must be valid HTTP/HTTPS URLs.

**❌ Bad:**
```json
{
  "content": "Hello",
  "avatar_url": "not-a-valid-url"
}
```

**✅ Good:**
```json
{
  "content": "Hello",
  "avatar_url": "https://example.com/avatar.png"
}
```

### 6. **Incorrect Content-Type Header**
When sending JSON, you must use the correct content type.

**❌ Bad:**
```
Content-Type: text/plain
```

**✅ Good:**
```
Content-Type: application/json
```

### 7. **Invalid Webhook URL**
The webhook URL must be complete and valid.

**❌ Bad:**
```
https://discord.com/api/webhooks/123/incomplete
```

**✅ Good:**
```
https://discord.com/api/webhooks/123456789/abcdefghijklmnopqrstuvwxyz
```

## Programming Language Specific Examples

### JavaScript/Node.js
```javascript
const webhook_url = "YOUR_WEBHOOK_URL";

// ❌ This will cause 400 error
const badPayload = {
  "username": "", // Empty username not allowed
  "embeds": [{
    "title": "A".repeat(300) // Too long title
  }]
};

// ✅ Correct payload
const goodPayload = {
  "content": "Hello from JavaScript!",
  "username": "JS Bot",
  "embeds": [{
    "title": "Valid Title",
    "description": "This is a valid embed",
    "color": 5814783
  }]
};

fetch(webhook_url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(goodPayload)
});
```

### Python
```python
import requests
import json

webhook_url = "YOUR_WEBHOOK_URL"

# ❌ This will cause 400 error
bad_payload = {
    "content": None,  # None values not allowed
    "embeds": "not an array"  # Should be array
}

# ✅ Correct payload
good_payload = {
    "content": "Hello from Python!",
    "username": "Python Bot",
    "embeds": [{
        "title": "Valid Title",
        "description": "This is a valid embed",
        "color": 5814783
    }]
}

response = requests.post(
    webhook_url,
    headers={"Content-Type": "application/json"},
    data=json.dumps(good_payload)
)
```

### curl
```bash
# ❌ This will cause 400 error (malformed JSON)
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello", invalid json}'

# ✅ Correct request
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello from curl!", "username": "Curl Bot"}'
```

## Troubleshooting Steps

### 1. **Validate Your JSON**
Use a JSON validator like:
- [JSONLint](https://jsonlint.com/)
- [JSON Formatter](https://jsonformatter.curiousconcept.com/)

### 2. **Check Field Limits**
Ensure all text fields are within Discord's character limits.

### 3. **Test with Minimal Payload**
Start with a simple payload and add fields gradually:
```json
{
  "content": "Test message"
}
```

### 4. **Verify Webhook URL**
Make sure your webhook URL is complete and hasn't been regenerated.

### 5. **Check Server Response**
Look at the full HTTP response for more specific error details:

```javascript
fetch(webhook_url, {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify(payload)
})
.then(response => {
  if (!response.ok) {
    return response.text().then(text => {
      console.error("Error:", response.status, text);
    });
  }
  return response.text();
})
.then(data => console.log("Success:", data))
.catch(error => console.error("Request failed:", error));
```

## Common Error Patterns from Forums

Based on community discussions, here are frequent mistakes:

1. **Using `contents` instead of `content`**
2. **Forgetting to escape special characters in JSON strings**
3. **Using hexadecimal color codes instead of decimal**
4. **Missing commas in JSON objects**
5. **Including `.Value` in variable declarations instead of in the function call**

## Rate Limiting Considerations

While not a 400 error, be aware of Discord's webhook rate limits:
- **5 requests per 2 seconds** per webhook
- Failed requests count toward the rate limit

## Testing Tools

- **Postman**: GUI tool for testing API requests
- **Insomnia**: Alternative to Postman
- **Discord Webhook Testers**: Online tools like Discohook
- **Browser Developer Tools**: Network tab for debugging

## Valid Webhook Structure Reference

```json
{
  "username": "Webhook Bot",
  "avatar_url": "https://example.com/avatar.png",
  "content": "Message content up to 2000 characters",
  "embeds": [{
    "author": {
      "name": "Author Name",
      "url": "https://example.com",
      "icon_url": "https://example.com/icon.png"
    },
    "title": "Embed Title",
    "url": "https://example.com",
    "description": "Embed description",
    "color": 16711680,
    "fields": [{
      "name": "Field Name",
      "value": "Field Value", 
      "inline": true
    }],
    "thumbnail": {
      "url": "https://example.com/thumb.png"
    },
    "image": {
      "url": "https://example.com/image.png"
    },
    "footer": {
      "text": "Footer text",
      "icon_url": "https://example.com/footer.png"
    },
    "timestamp": "2023-01-01T12:00:00.000Z"
  }],
  "tts": false,
  "allowed_mentions": {
    "parse": ["users", "roles"],
    "users": ["123456789"],
    "roles": ["987654321"]
  }
}
```

## Summary

HTTP 400 Bad Request errors in Discord webhooks are almost always due to:
1. Invalid JSON syntax
2. Missing required fields
3. Exceeding field length limits
4. Using incorrect data types
5. Invalid URLs

Always validate your JSON, check field limits, and test with minimal payloads when troubleshooting. The Discord API is strict about data validation, so ensuring your payload matches the expected format exactly is crucial for successful webhook delivery.