export async function PUT(request: Request) {
  const body = await request.json();
  const cnImageUrl = "http://127.0.0.1:4181/api/cn-image/model-config";
  try {
    const res = await fetch(cnImageUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (e) {
    return Response.json({ error: "cn-image unreachable" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  if (body.action === "restore" && body.filename) {
    try {
      const res = await fetch("http://127.0.0.1:4181/api/cn-image/model-config/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: body.filename }),
      });
      const data = await res.json();
      return Response.json(data, { status: res.status });
    } catch (e) {
      return Response.json({ error: "cn-image unreachable" }, { status: 502 });
    }
  }
  return Response.json({ error: "unknown action" }, { status: 400 });
}
