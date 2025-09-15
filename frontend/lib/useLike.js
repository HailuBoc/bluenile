"use client";
import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:10000"; // your backend

export function useLike(type, id) {
  const [likes, setLikes] = useState(0);

  // fetch current likes
  useEffect(() => {
    if (!id) return;
    fetch(`${BASE_URL}/api/likes/${type}/${id}`)
      .then((res) => res.json())
      .then((data) => setLikes(data.likes || 0))
      .catch((err) => console.error("Fetch likes error:", err));
  }, [id, type]);

  // increment likes
  const toggleLike = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/likes/${type}/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      setLikes(data.likes || 0); // update from backend
    } catch (err) {
      console.error("Update like error:", err);
    }
  };

  return { likes, toggleLike };
}

export async function updateLikes(type, id) {
  try {
    const res = await fetch(`${BASE_URL}/api/likes/${type}/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data.likes || 0;
  } catch (err) {
    console.error("Like error:", err);
    return null;
  }
}
