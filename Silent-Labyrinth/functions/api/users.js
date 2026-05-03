export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const ADMIN_PASS = "alireza123"; // رمز ادمین را اینجا تغییر بده

    if (request.method === "GET" && url.searchParams.has("user")) {
        const user = url.searchParams.get("user");
        const data = await env.MY_DB.get(user, { type: "json" });
        if (!data) return new Response(JSON.stringify({ error: "Not found" }));
        return new Response(JSON.stringify(data));
    }

    const auth = request.headers.get("Authorization");
    if (auth !== ADMIN_PASS) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    if (request.method === "GET") {
        const list = await env.MY_DB.list();
        return new Response(JSON.stringify(list));
    }

    if (request.method === "POST") {
        const body = await request.json();
        await env.MY_DB.put(body.user, JSON.stringify({ total: body.total, used: body.used }));
        return new Response(JSON.stringify({ success: true }));
    }

    if (request.method === "DELETE") {
        const body = await request.json();
        await env.MY_DB.delete(body.user);
        return new Response(JSON.stringify({ success: true }));
    }

    return new Response("Method not allowed", { status: 405 });
}
