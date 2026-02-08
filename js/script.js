document.addEventListener("DOMContentLoaded", () => {

  const page = window.location.pathname;

  /* ================= HOME PAGE ================= */
  /* ================= HOME PAGE ================= */
  const createIdBtn = document.getElementById("createIdBtn");
if (createIdBtn) {
  if (page.includes("home")) {

  const createIdBtn = document.getElementById("createIdBtn");
  const joinChatBtn = document.getElementById("joinChatBtn");
  const joinIdInput = document.getElementById("joinIdInput");

  if (!createIdBtn || !joinChatBtn || !joinIdInput) {
    console.error("Home page elements not found");
    return;
  }

  createIdBtn.onclick = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    sessionStorage.setItem("roomId", roomId);
    alert("Chat ID:\n\n" + roomId);
  };

  joinChatBtn.onclick = () => {
    const roomId = joinIdInput.value.trim();
    if (!roomId) return alert("Enter Chat ID");

    sessionStorage.setItem("roomId", roomId);
    window.location.href = "chat.html";
  };
}
}

  



  /* ================= CHAT PAGE ================= */

  const sendBtn = document.getElementById("sendBtn");
if (sendBtn) {
   if (page.includes("chat")) {

    const roomId = sessionStorage.getItem("roomId");
    const statusText = document.getElementById("statusText");
const userCount = document.getElementById("userCount");
const sendBtn = document.getElementById("sendBtn");
const msgInput = document.getElementById("msgInput");
const mediaBtn = document.getElementById("mediaBtn");
const mediaInput = document.getElementById("mediaInput");
const leaveBtn = document.getElementById("leaveBtn");
const chatBox = document.getElementById("chatBox");

    if (!roomId) return location.href = "home.html";

    const ws = new WebSocket("wss://keychat-backend.onrender.com");


    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", roomId }));
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "status") {
        statusText.innerText = msg.text || "Connected";
        userCount.innerText = msg.count + " online";
      }

      if (msg.type === "chat") {
        addMessage(msg.text, "other");
      }

      // ✅ IMAGE RECEIVE (FIX)
      if (msg.type === "media" && msg.mediaType === "image") {
        addImage(msg.data, "other");
      }
    };

    sendBtn.onclick = sendText;

    msgInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendText();
    });

    mediaBtn.onclick = () => mediaInput.click();
    mediaInput.onchange = () => {
      if (mediaInput.files[0]) sendImage(mediaInput.files[0]);
    };

    leaveBtn.onclick = () => {
      sessionStorage.removeItem("roomId");
      location.href = "home.html";
    };

    function sendText() {
      const text = msgInput.value.trim();
      if (!text) return;

      ws.send(JSON.stringify({
        type: "chat",
        text
      }));

      addMessage(text, "you");
      msgInput.value = "";
    }
}

 

    /* ================= IMAGE SEND (ONLY IMAGE) ================= */
    function sendImage(file) {

      if (!file.type.startsWith("image")) {
        alert("Only images allowed");
        return;
      }

      // ⚠️ size limit
      if (file.size > 400 * 1024) {
        alert("Image too large. Max 400KB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {

        ws.send(JSON.stringify({
          type: "media",
          roomId: roomId,
          mediaType: "image",
          data: reader.result
        }));

        addImage(reader.result, "you");
      };

      reader.readAsDataURL(file);
    }

    function addMessage(text, type) {
      const div = document.createElement("div");
      div.className = `msg ${type}`;
      div.innerText = text;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    /* ================= IMAGE RENDER ================= */
    function addImage(data, type) {
      const wrapper = document.createElement("div");
      wrapper.className = `msg ${type}`;

      const img = document.createElement("img");
      img.src = data;
      img.style.maxWidth = "230px";
      img.style.borderRadius = "14px";

      wrapper.appendChild(img);
      chatBox.appendChild(wrapper);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }

});
