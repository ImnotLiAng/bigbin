const el = document.createElement('button');
el.id = "counter";
let count = 0;
const btnText = () => "count is " + count;
el.innerText = btnText();
el.addEventListener("click", () => {
  count++;
  const el: HTMLButtonElement | null = document.querySelector("#counter");
  if (el) el.innerText = btnText();
})
export default el;