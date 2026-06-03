
exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body || "{}");
    const token = process.env.TELEGRAM_TOKEN;

    const recipients = [
      process.env.CHAT_ID_1,
      process.env.CHAT_ID_2,
      process.env.CHAT_ID_3
    ].filter(Boolean);

    const results = await Promise.all(
      recipients.map(chat_id =>
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id,
            text: message
          })
        }).then(r => r.json())
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: results.some(r => r.ok) })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success:false, error:e.message })
    };
  }
};
