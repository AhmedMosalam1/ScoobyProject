const catchAsync = require("express-async-handler");
const appError = require("../utils/appError")

exports.chatBot = catchAsync(async (req, res,next) => {
    const url = process.env.FOREFRONT_URL
    const api_key = process.env.FOREFRONT_API_KEY
    
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            authorization: `${api_key}`
        },
        body: JSON.stringify({ 
            model:process.env.FOREFRONT_MODEL ,// forefront/Mistral-7B-claude-chat
            messages: [
                {
                    "role": "user",
                    "content": req.body.search
                }
            ],
            max_tokens: 128,
            temperature: 0.5,
        })
    };
    
    try {
        const response = fetch(url, options)
            .then(response => response.json())
            .then(data => res
                .status(200)
                .json({ results: data.choices[0].message.content}));
            
    } catch (error) {
        console.error(error);
        return next(new appError("Please Try Again....", 404));
    }
});


