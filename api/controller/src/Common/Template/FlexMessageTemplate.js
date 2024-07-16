exports.Template = () => {
    return {
        type: "flex",
        altText: "This is a Flex Message",
        contents: {
            type: "bubble",
            body: {
                type: "box",
                layout: "horizontal",
                contents: [
                    {
                        type: "text",
                        text: "Hello,"
                    },
                    {
                        type: "text",
                        text: "World!"
                    }
                ]
            }
        }
    };
};