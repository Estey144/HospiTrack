# Security Guide for HospiTrack

## API Key Security

### ⚠️ NEVER commit API keys to version control!

This project uses OpenRouter AI API for the symptom checker feature. Follow these security practices:

## Setup Instructions

1. **Get your OpenRouter API key**:
   - Visit: https://openrouter.ai/keys
   - Create an account and generate an API key

2. **Configure environment variables**:
   ```bash
   cd Frontend
   cp .env.example .env
   ```

3. **Add your API key to `.env`**:
   ```
   REACT_APP_OPENROUTER_API_KEY=your_actual_api_key_here
   ```

4. **Verify `.env` is in `.gitignore`**:
   - The `.env` file should never be committed
   - Only commit `.env.example` with placeholder values

## Security Best Practices

### For Developers:
- ✅ Use environment variables for all sensitive data
- ✅ Add `.env` to `.gitignore`
- ✅ Use `.env.example` to show required variables
- ❌ Never hardcode API keys in source code
- ❌ Never commit `.env` files

### For Production Deployment:
- Use secure environment variable management
- Rotate API keys regularly
- Monitor API usage for unusual activity
- Use separate API keys for development/production

## API Key Exposed? Here's what to do:

1. **Immediately revoke** the exposed API key
2. **Generate a new** API key
3. **Update your local** `.env` file
4. **Remove the key** from git history if committed:
   ```bash
   # This is a destructive operation - use with caution
   git filter-branch --env-filter '
   if [ "$GIT_COMMIT" = "commit_hash_with_key" ]; then
       export REACT_APP_OPENROUTER_API_KEY=""
   fi' --all
   ```

## Environment Variables Used

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_OPENROUTER_API_KEY` | OpenRouter AI API key | Yes |
| `REACT_APP_OPENROUTER_API_URL` | API endpoint URL | No (has default) |
| `REACT_APP_DEEPSEEK_MODEL` | AI model name | No (has default) |

## Support

If you have security concerns or questions, please contact the development team.
