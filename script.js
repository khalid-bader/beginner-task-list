// كل مهمة لها نص وحالة إنجاز ومعرّف.
const key = 'beginner-tasks-v1';
let tasks = [];
const form = document.querySelector('#form');
const input = document.querySelector('#input');
const list = document.querySelector('#list');
const message = document.querySelector('#message');
try {
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  if (Array.isArray(saved)) tasks = saved.filter(t => t && typeof t.text === 'string' && typeof t.done === 'boolean' && typeof t.id === 'string');
} catch { message.textContent = 'تعذر قراءة الحفظ السابق.'; }
function save() {
  try { localStorage.setItem(key, JSON.stringify(tasks)); }
  catch { message.textContent = 'الحفظ غير متاح؛ البيانات لهذه الجلسة فقط.'; }
}
// إنشاء العناصر بالنص يحمي من تفسير إدخال المستخدم كـ HTML.
function render() {
  list.replaceChildren();
  for (const task of tasks) {
    const li = document.createElement('li'); li.className = 'item';
    const check = document.createElement('input'); check.type = 'checkbox'; check.checked = task.done;
    check.setAttribute('aria-label', 'إكمال: ' + task.text);
    check.addEventListener('change', () => { task.done = check.checked; save(); render(); });
    const text = document.createElement('span'); text.textContent = task.text;
    if (task.done) text.className = 'done';
    const remove = document.createElement('button'); remove.textContent = 'حذف';
    remove.setAttribute('aria-label', 'حذف: ' + task.text);
    remove.addEventListener('click', () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); });
    li.append(check, text, remove); list.append(li);
  }
  document.querySelector('#remaining').textContent = tasks.filter(t => !t.done).length;
  document.querySelector('#empty').hidden = tasks.length > 0;
}
form.addEventListener('submit', e => {
  e.preventDefault(); const text = input.value.trim();
  if (!text) { message.textContent = 'اكتب مهمة أولًا.'; return; }
  tasks.push({id: Date.now() + '-' + Math.random(), text, done: false});
  message.textContent = 'تمت الإضافة.'; save(); render(); form.reset(); input.focus();
});
render();
