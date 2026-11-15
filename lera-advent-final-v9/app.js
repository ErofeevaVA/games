const ADVENT_DATA=[["Амка","США","Укутай игрушечную собачку тёплым шарфиком!"],["Амон","Танзания","Найди три карандаша для школьного рюкзака!"],["Киан","Ирландия","Нарисуй зелёный клевер с четырьмя листочками!"],["Камила","Бразилия","Потанцуй под весёлую музыку!"],["Андреа","Мексика","Нарисуй разноцветную бабочку!"],["Арчи","Великобритания","Найди спрятанную игрушку!"],["Али","Марокко","Сделай три снежка из ваты!"],["Мехмет","Турция","Пройди полосу препятствий из подушек!"],["Барака","Кения","Выбери три вещи для путешествия!"],["Мориц","Австрия","Покажи фокус со спрятанной игрушкой!"],["Гаспар","Франция","Построй Эйфелеву башню из кубиков!"],["Максим","Казахстан","Нарисуй ракету и большую Луну!"],["Иван","Хорватия","Покажи, как прыгает собачка!"],["Найла","Аргентина","Найди игрушечную лошадку!"],["Сачи","Турция","Найди спрятанный мячик!"],["Юки","Япония","Сложи бумажный самолётик!"],["Галилея","Италия","Нарисуй ночное небо с пятью звёздами!"],["Рума","Бангладеш","Собери три игрушечных фрукта!"],["Нина","Нидерланды","Наряди куклу к празднику!"],["Габриэль","Колумбия","Покрути волчок или покружись!"],["Алиса","Норвегия","Сделай корону снежной принцессы!"],["Сильвия","Болгария","Нарисуй цветок с пятью лепестками!"],["Кевин","США","Нарисуй праздничную машинку!"],["Солина","Камбоджа","Найди три жёлтых предмета!"],["Хару","Япония","Построй робота из кубиков!"],["Оливия","Великобритания","Порычи, как добрый лев!"],["Леа","Швейцария","Собери машинку из конструктора!"],["Карл","Норвегия","Построй игрушечный корабль!"],["Лука","Италия","Нарисуй карнавальную маску!"],["Мариам","Катар","Нарисуй праздничную шапочку для верблюда!"],["Лоренцо","Италия, Рим","Построй Колизей из кубиков!"]];
(function gameRuntime(){
const root=document.getElementById("advent");
if(!root)return;
const $=s=>root.querySelector(s);
const data=ADVENT_DATA;
const key="lera-advent-2026-final",pinKey="lera-advent-parent-pin";
let done={};try{done=JSON.parse(localStorage.getItem(key)||"{}")||{}}catch(e){}
let preview=false,authorized=false,timer=null;
const num=n=>String(n).padStart(2,"0"),total=()=>data.filter((v,i)=>done[i+1]===true).length;
const open=n=>preview||new Date()>=new Date(2026,11,n);
function store(){try{localStorage.setItem(key,JSON.stringify(done))}catch(e){}}
function draw(){
$("#score").textContent="⭐ "+total()+" / 31";
$("#fill").style.width=(total()/31*100)+"%";
$("#test").hidden=!preview;
$("#days").innerHTML=data.map((row,i)=>{
const n=i+1;
return `<button type="button" data-day="${n}" class="day ${open(n)?"":"locked"} ${done[n]?"done":""}"><span class="num">${num(n)}</span><span class="mark">${done[n]?"⭐":open(n)?"✈️":"🔒"}</span><img src="./images/characters/${num(n)}.jpg" alt="${row[0]}"><strong>${row[0]}</strong><small>${row[1]}</small></button>`;
}).join("");
}
function show(content){$("#content").innerHTML=content;$("#overlay").hidden=false}
function close(){if(timer)clearTimeout(timer);timer=null;$("#overlay").hidden=true}
function portrait(n){return `<img class="large" src="./images/characters/${num(n)}.jpg" alt="${data[n-1][0]}">`}
function day(n){
const row=data[n-1];
if(!open(n)){
const remaining=Math.max(1,Math.ceil((new Date(2026,11,n)-new Date())/86400000));
show(`<div class="emoji">🔒</div><h2>Ещё рано!</h2><p>Лера, это окошко откроется ${n} декабря. Осталось ${remaining} дн.</p>`);return;
}
show(`${portrait(n)}<h2>Привет, Лера! Я ${row[0]}!</h2><p>Сегодня мы отправимся в ${row[1]}!</p><button data-act="fly" data-n="${n}">✈️ Полетели!</button>`);
}
function mission(n){
show(`${portrait(n)}<h2>Задание от ${data[n-1][0]}</h2><p>${data[n-1][2]}</p><button data-act="finish" data-n="${n}">✅ Задание выполнено!</button>`);
}
function fly(n){
show(`<div class="emoji">✈️ ☁️</div><h2>Летим в ${data[n-1][1]}!</h2><p>Приготовься к приключению!</p>`);
timer=setTimeout(()=>mission(n),850);
}
function finish(n){
if(!preview){done[n]=true;store();draw()}
show(`<div class="emoji">🌟</div><h2>Ура, Лера!</h2><p>Ты помогла ${data[n-1][0]}!</p><button data-act="close">К календарю</button>`);
}
function getPin(){try{return localStorage.getItem(pinKey)}catch(e){return null}}
function login(){
if(authorized){panel();return}
show(`<h2>Родительский режим</h2><p>Введите четырёхзначный PIN</p><input id="pin" type="password" inputmode="numeric" maxlength="4"><p id="error"></p><button data-act="verify">Продолжить</button>`);
}
function verify(){
const v=$("#pin").value,stored=getPin();
if(!/^\d{4}$/.test(v)||stored&&v!==stored){$("#error").textContent="Неверный код";return}
if(!stored){try{localStorage.setItem(pinKey,v)}catch(e){}}
authorized=true;panel();
}
function panel(){
show(`<h2>Для родителей</h2><p>Предпросмотр дней не сохраняет звёздочки.</p><button data-act="toggle">${preview?"Закрыть будущие дни":"Открыть все дни"}</button><button data-act="reset">Сбросить прогресс</button><button data-act="logout">Закрыть</button>`);
}
$("#days").addEventListener("click",e=>{const b=e.target.closest("[data-day]");if(b)day(Number(b.dataset.day))});
$("#content").addEventListener("click",e=>{
const b=e.target.closest("[data-act]");if(!b)return;
const n=Number(b.dataset.n),act=b.dataset.act;
if(act==="fly")fly(n);
if(act==="finish")finish(n);
if(act==="close")close();
if(act==="verify")verify();
if(act==="toggle"){preview=!preview;draw();close()}
if(act==="logout"){authorized=false;preview=false;draw();close()}
if(act==="reset"){if(confirm("Сбросить все звёзды?")){done={};store();draw()}panel()}
});
$("#parent").onclick = login;

const closeButton = $("#close");

// Закрытие при обычном клике
closeButton.addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();
  close();
});

// Дополнительная обработка касания на телефоне
closeButton.addEventListener("pointerup", function (event) {
  if (event.pointerType === "mouse") return;

  event.preventDefault();
  event.stopPropagation();
  close();
});
$("#overlay").onclick=e=>{if(e.target===$("#overlay"))close()};
$("#stop").onclick=()=>{preview=false;authorized=false;draw()};
draw();
})();
if("serviceWorker"in navigator&&(location.protocol==="https:"||location.hostname==="localhost"))navigator.serviceWorker.register("./service-worker.js").catch(()=>{});

function sendAdventHeight() {
  if (window.parent === window) return;

  window.parent.postMessage({
    type: "lera-advent-height",
    height: document.documentElement.scrollHeight
  }, "*");
}

window.addEventListener("load", sendAdventHeight);

if (window.ResizeObserver) {
  const advent = document.getElementById("advent");

  if (advent) {
    new ResizeObserver(sendAdventHeight).observe(advent);
  }
}

(function setupVisiblePopup() {
  const advent = document.getElementById("advent");
  const overlay = document.getElementById("overlay");

  if (!advent || !overlay) return;

  // Если игра открыта напрямую на GitHub Pages,
  // оставляем обычное центрирование окна.
  if (window.parent === window) return;

  advent.style.position = "relative";

  const parentOrigin = "https://erofeeva-vika.tilda.ws";

  window.addEventListener("message", function (event) {
    if (event.source !== window.parent) return;
    if (event.origin !== parentOrigin) return;

    const data = event.data;

    if (!data || data.type !== "lera-advent-visible-area") {
      return;
    }

    const top = Number(data.top);
    const height = Number(data.height);

    if (!Number.isFinite(top)) return;
    if (!Number.isFinite(height) || height < 40) return;

    // Вместо центрирования по всему iframe
    // центрируем окно по видимой области.
    overlay.style.position = "absolute";
    overlay.style.inset = "auto 0 auto 0";
    overlay.style.top =
      Math.max(0, top + window.scrollY) + "px";
    overlay.style.height = height + "px";
    overlay.style.width = "100%";

    const modal = overlay.querySelector(".modal");

    if (modal) {
      modal.style.maxHeight =
        Math.max(80, height - 24) + "px";
    }
  });

  // Каждый раз при открытии окна запрашиваем
  // актуальное положение экрана у Tilda.
  const observer = new MutationObserver(function () {
    if (!overlay.hidden) {
      window.parent.postMessage({
        type: "lera-advent-popup-open"
      }, "*");
    }
  });

  observer.observe(overlay, {
    attributes: true,
    attributeFilter: ["hidden"]
  });

  window.parent.postMessage({
    type: "lera-advent-popup-open"
  }, "*");
})();

(function () {
  const content = document.getElementById("content");
  const overlay = document.getElementById("overlay");

  if (!content || !overlay) return;
  if (window.parent === window) return;

  new MutationObserver(function () {
    if (overlay.hidden) return;

    window.parent.postMessage(
      { type: "lera-advent-popup-open" },
      "https://erofeeva-vika.tilda.ws"
    );
  }).observe(content, {
    childList: true
  });
})();
