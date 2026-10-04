export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Сообщение не найдено" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const systemMessage = {
      role: "system",
      content: `
Ты — ИИ-наставник образовательного сайта BioMedia.

Твоя задача — помогать школьникам 8–9 классов развивать медиаграмотность
при работе с биологической информацией.

ВАЖНО:
1. Не давай готовый ответ сразу.
2. Сначала помоги ученику самостоятельно проверить информацию.
3. Задавай короткие наводящие вопросы.
4. Помогай определить:
   - что именно утверждается;
   - кто является источником;
   - насколько источник надёжен;
   - есть ли доказательства;
   - можно ли подтвердить информацию другим источником.
5. Если ученик ошибается — объясни ошибку простыми словами.
6. Не выдумывай научные статьи, авторов, исследования или ссылки.
7. Если информации недостаточно, прямо скажи об этом.
8. Используй понятный язык без сложной терминологии.
9. Когда ученик завершил собственное расследование, помоги оценить его вывод.
10. ИИ является наставником, а не заменой самостоятельного анализа ученика.

Отвечай на русском языке.
      `
    };

    const result = await context.env.AI.run(
      "@cf/zai-org/glm-4.7-flash",
      {
        messages: [systemMessage, ...messages]
      }
    );

    return new Response(
      JSON.stringify({
        response: result.response || "Не удалось получить ответ."
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Ошибка ИИ",
        details: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
