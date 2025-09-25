document.addEventListener("DOMContentLoaded", () => {
  const envelope = document.getElementById("envelope");
  const letter = envelope.querySelector(".letter");
  const lidOne = envelope.querySelector(".lid.one");
  const lidTwo = envelope.querySelector(".lid.two");
  const heartCanvas = document.getElementById("heart");
  const paperDialog = document.getElementById("paperDialog");
  const confirmBtn = document.getElementById("confirmBtn");

  // 點擊信封 → 開啟動畫
  envelope.addEventListener("click", () => {
    lidOne.style.transform = "rotateX(90deg)";
    lidOne.style.transitionDelay = "0s";
    lidTwo.style.transform = "rotateX(180deg)";
    lidTwo.style.transitionDelay = "0.25s";
    letter.style.transform = "translateY(-50px)";
    letter.style.transitionDelay = "0.5s";

    // 2 秒後出現信紙 dialog
    setTimeout(() => {
      envelope.style.display = "none";
      paperDialog.style.display = "block";
      // clickText.style.display = "block";
      // canClick = true;
      
      // 加 show class → 從上滑入
      setTimeout(() => {
        paperDialog.classList.add("show");
      }, 50);
    }, 2000);
  });
  

  // 點擊確認 → 信紙淡出 → 愛心開始
  confirmBtn.addEventListener("click", () => {
  // 信紙淡出動畫
  paperDialog.classList.remove("show");
  paperDialog.classList.add("fade-out");

  // 等淡出完成再開始心跳
  setTimeout(() => {
    paperDialog.style.display = "none";
    heartCanvas.style.display = "block";

    if (typeof startHeart === "function") {
      startHeart();
    }
  }, 1000); // 跟 CSS transition 時間一致
});


});