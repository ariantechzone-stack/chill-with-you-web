export async function syncUp(userId, payload) {
  await fetch("/api/save", {
    method: "POST",
    body: JSON.stringify({ userId, payload })
  });
}

export async function syncDown(userId) {
  const res = await fetch(`/api/load?user=${userId}`);
  return await res.json();
}
