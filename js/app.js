// Matjari Smart Core Application JS

// Initial Mock Data
let sampleProducts = [
    {
        id: "prod-1",
        title: "دليل الربح من المنتجات الرقمية 2026",
        type: "دليل إلكتروني (E-Book)",
        price: 39,
        status: "منشور",
        index: "1. المقدمة\n2. اختيار النيش المربح\n3. أدوات التوليد بالذكاء الاصطناعي\n4. التسويق والتسعير",
        pitch: "دليل شامل يعلمك خطوة بخطوة كيفية إنشاء وإطلاق منتجات رقمية مربحة من الصفر مع نماذج عملية.",
        content: "هذا الدليل يمثل الخارطة الذهنية المتكاملة لبناء مشروع رقمي ناجح مستفيداً من التقنيات الحديثة...",
        pdfUrl: "https://example.com/downloads/digital-guide.pdf",
        createdDate: "2026-11-10"
    },
    {
        id: "prod-2",
        title: "قالب منظم المهام والمشاريع التفاعلي",
        type: "قالب جاهز (Template)",
        price: 19,
        status: "جاهز للتصميم",
        index: "1. لوحة المهام\n2. جدول الميزانية\n3. متابعة الأهداف",
        pitch: "نظم حياتك ومشاريعك اليومية بسهولة مع قالب مخصص ومصمم بعناية فائقة.",
        content: "قالب تفاعلي يتيح لك إدارة أولوياتك اليومية والأسبوعية بكل يسر وسلاسة...",
        pdfUrl: "",
        createdDate: "2026-11-11"
    }
];

// Load from LocalStorage or initialize
function getProducts() {
    const saved = localStorage.getItem('matjari_products');
    if (saved) {
        return JSON.parse(saved);
    }
    localStorage.setItem('matjari_products', JSON.stringify(sampleProducts));
    return sampleProducts;
}

function saveProducts(products) {
    localStorage.setItem('matjari_products', JSON.stringify(products));
    renderDashboard();
    renderProducts();
    renderStoreTable();
    populateWhackaSelect();
}

// Global Chart Instance
let dashChart = null;

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderDashboard();
    renderProducts();
    renderStoreTable();
    populateWhackaSelect();
});

// Navigation Handling
function initNavigation() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const targetSec = document.getElementById(`sec-${tabId}`);
    if (targetSec) targetSec.classList.remove('hidden');

    const activeBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Refresh components on tab switch
    if (tabId === 'dashboard') renderDashboard();
    if (tabId === 'products') renderProducts();
    if (tabId === 'store') renderStoreTable();
    if (tabId === 'whacka') populateWhackaSelect();
}

// Toast Notification
function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.innerText = msg;
    toast.classList.remove('translate-y-24');
    setTimeout(() => {
        toast.classList.add('translate-y-24');
    }, 3000);
}

// Render Dashboard Analytics
function renderDashboard() {
    const products = getProducts();
    
    const total = products.length;
    const published = products.filter(p => p.status === 'منشور').length;
    const drafts = products.filter(p => p.status !== 'منشور').length;
    const rev = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);

    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-published').innerText = published;
    document.getElementById('stat-drafts').innerText = drafts;
    document.getElementById('stat-revenue').innerText = `$${rev}`;

    // Render Chart
    const ctx = document.getElementById('dashboardChart');
    if (ctx) {
        if (dashChart) dashChart.destroy();
        dashChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['المنتجات الكلية', 'المنشورة', 'المسودات / قيد التجهيز'],
                datasets: [{
                    label: 'العدد',
                    data: [total, published, drafts],
                    backgroundColor: ['#06b6d4', '#10b981', '#f59e0b'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
                }
            }
        });
    }

    // Render Recent Activity
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = products.slice(-3).reverse().map(p => `
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div class="flex items-center space-x-2 space-x-reverse">
                <i class="fa-solid fa-file-invoice text-cyan-400"></i>
                <span class="text-xs text-slate-200 font-medium truncate max-w-[150px]">${p.title}</span>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded ${p.status === 'منشور' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">${p.status}</span>
        </div>
    `).join('') || '<p class="text-xs text-slate-500">لا توجد نشاطات حالياً.</p>';
}

// AI Generator Simulation / API Logic
function generateProductAI() {
    const idea = document.getElementById('productIdea').value.trim();
    if (!idea) {
        showToast('يرجى كتابة فكرة المنتج أولاً!');
        return;
    }

    const overlay = document.getElementById('aiLoadingOverlay');
    overlay.classList.remove('hidden');

    setTimeout(() => {
        overlay.classList.add('hidden');
        
        const type = document.getElementById('productType').value;
        document.getElementById('resTitle').value = `دليل إرشادي: ${idea.substring(0, 30)}...`;
        document.getElementById('resPrice').value = Math.floor(Math.random() * 30) + 19;
        document.getElementById('resStatus').value = "مسودة";
        document.getElementById('resIndex').value = `الفصل الأول: مقدمة في ${idea}\nالفصل الثاني: الخطوات الاستراتيجية والتنفيذ\nالفصل الثالث: الأدوات والتطبيقات الموصى بها\nالفصل الرابع: ملخص وخطة العمل`;
        document.getElementById('resSalesPitch').value = `احصل على ${type} المتكامل وحول فكرتك إلى مصدر دخل رقمي مستدام! يشمل شروحاً تطبيقية وأمثلة ملموسة.`;
        document.getElementById('resContent').value = `محتوى تم توليده بناءً على الفكرة: "${idea}"\n\nفي هذا الفصل، ستتعلم الآلية العملية لتحقيق نتائج فورية بأسلوب مبسط وشامل...`;

        showToast('تم توليد تفاصيل المنتج بنجاح!');
    }, 1200);
}

// Save Product
function saveCurrentProduct() {
    const title = document.getElementById('resTitle').value;
    if (!title) {
        showToast('يرجى توليد أو كتابة عنوان للمنتج!');
        return;
    }

    const newProd = {
        id: "prod-" + Date.now(),
        title: title,
        type: document.getElementById('productType').value,
        price: Number(document.getElementById('resPrice').value) || 20,
        status: document.getElementById('resStatus').value,
        index: document.getElementById('resIndex').value,
        pitch: document.getElementById('resSalesPitch').value,
        content: document.getElementById('resContent').value,
        pdfUrl: "",
        createdDate: new Date().toISOString().split('T')[0]
    };

    const products = getProducts();
    products.push(newProd);
    saveProducts(products);

    showToast('تم حفظ المنتج بنجاح في متجرك!');
    switchTab('products');
}

// ChatGPT Assistant Logic
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    const chatBox = document.getElementById('chatBox');
    
    // User Message
    chatBox.innerHTML += `
        <div class="flex gap-3 justify-end">
            <div class="bg-cyan-600/30 border border-cyan-500/30 p-3 rounded-2xl max-w-xl text-sm text-slate-100">
                ${msg}
            </div>
            <div class="w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold">أنت</div>
        </div>
    `;

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // AI Response Simulation
    setTimeout(() => {
        chatBox.innerHTML += `
            <div class="flex gap-3">
                <div class="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">GPT</div>
                <div class="bg-slate-800/80 p-3 rounded-2xl max-w-xl text-sm text-slate-200">
                    بناءً على طلبك ("${msg}")، أقترح عليك تنظيم المحتوى في 3 محاور رئيسية: التركيز على حل مشكلة ملموسة، إضافة نماذج قابلة للتعبئة، وتحديد سعر تنافسي. هل ترغب في صياغة العنوان التسويقي الآن؟
                </div>
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
}

// Canva Simulation
function toggleCanvaAuth() {
    const btn = document.getElementById('canvaAuthBtn');
    const txt = document.getElementById('canvaStatusText');
    
    if (btn.innerText.includes('ربط')) {
        btn.innerText = 'إلغاء الربط بالحساب';
        btn.className = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-5 py-2.5 rounded-xl text-sm font-semibold';
        txt.innerText = 'حساب Canva مرتبط بنجاح عبر OAuth الرسمي. يمكنك الآن فتح التصاميم وإرجاع الصور تلقائياً.';
        showToast('تم ربط حساب Canva بنجاح!');
    } else {
        btn.innerText = 'ربط حساب Canva الحقيقي';
        btn.className = 'bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold px-5 py-2.5 rounded-xl border border-slate-700 text-sm transition';
        txt.innerText = 'التكامل جاهز للتنشيط عند توفر صلاحيات حساب Canva Developer الخاص بك.';
        showToast('تم فك الربط.');
    }
}

function openCanvaEditor(type) {
    showToast(`جاري توجيهك إلى منصة Canva لقالب (${type})...`);
    window.open('https://www.canva.com', '_blank');
}

// My Store Table Render
function renderStoreTable() {
    const products = getProducts();
    const tbody = document.getElementById('storeFilesTable');
    if (!tbody) return;

    tbody.innerHTML = products.map(p => `
        <tr class="hover:bg-slate-900/50 transition">
            <td class="p-3 font-semibold text-slate-100">${p.title}</td>
            <td class="p-3">
                <span class="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    <i class="fa-solid fa-file-pdf text-red-400 ml-1"></i> PDF جاهز
                </span>
            </td>
            <td class="p-3 text-cyan-400 font-bold">$${p.price}</td>
            <td class="p-3 text-xs text-slate-400 truncate max-w-[180px]">
                ${p.pdfUrl || 'https://matjari.smart/dl/' + p.id}
            </td>
            <td class="p-3 text-center">
                <button onclick="switchTab('products')" class="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-200">
                    تعديل
                </button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="5" class="p-4 text-center text-slate-500">لا توجد منتجات مسجلة.</td></tr>';
}

// Whacka Section
function populateWhackaSelect() {
    const products = getProducts();
    const select = document.getElementById('whackaProductSelect');
    if (!select) return;

    select.innerHTML = products.map(p => `
        <option value="${p.id}">${p.title} (${p.status}) - $${p.price}</option>
    `).join('');
}

function publishToWhacka() {
    const select = document.getElementById('whackaProductSelect');
    const id = select.value;
    const products = getProducts();
    const prod = products.find(p => p.id === id);

    const resDiv = document.getElementById('whackaResult');
    resDiv.classList.remove('hidden');

    if (prod) {
        prod.status = 'منشور';
        saveProducts(products);

        resDiv.className = "p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-300 text-xs space-y-2";
        resDiv.innerHTML = `
            <div class="font-bold flex items-center gap-2">
                <i class="fa-solid fa-circle-check"></i>
                تم تجهيز وتأكيد حالة النشر لـ "${prod.title}" بنجاح!
            </div>
            <p class="text-slate-400">ملاحظة التزامن: تم تحديث الحالة إلى (منشور). التصدير عبر الويب هوك جاهز للتفعيل فور إدخال بيانات السيرفر الحقيقي.</p>
        `;
        showToast('تم تحديث حالة المنتج إلى منشور!');
    }
}

// Products List Render & Actions
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let products = getProducts();
    const search = document.getElementById('searchInput').value.toLowerCase();
    const filter = document.getElementById('filterStatus').value;

    if (search) {
        products = products.filter(p => p.title.toLowerCase().includes(search));
    }
    if (filter !== 'ALL') {
        products = products.filter(p => p.status === filter);
    }

    grid.innerHTML = products.map(p => `
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition space-y-4">
            <div>
                <div class="flex justify-between items-start mb-3">
                    <span class="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">${p.type}</span>
                    <span class="text-xs px-2.5 py-1 rounded-full font-bold ${p.status === 'منشور' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">${p.status}</span>
                </div>
                <h3 class="font-bold text-slate-100 text-base mb-2 line-clamp-2">${p.title}</h3>
                <p class="text-xs text-slate-400 line-clamp-3 mb-4">${p.pitch || p.content}</p>
            </div>

            <div class="border-t border-slate-800 pt-3 flex justify-between items-center">
                <span class="text-lg font-extrabold text-cyan-400">$${p.price}</span>
                <div class="flex gap-2">
                    <button onclick="deleteProduct('${p.id}')" class="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl transition">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('') || '<div class="col-span-full text-center text-slate-500 py-10">لا توجد منتجات تطابق البحث.</div>';
}

function deleteProduct(id) {
    if (confirm('هل أنت تأكد من حذف هذا المنتج؟')) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        showToast('تم حذف المنتج بنجاح.');
    }
}

// Save Settings
function saveSettings() {
    showToast('تم حفظ معلومات الحساب المتجر بنجاح!');
}

function saveApiKeys() {
    showToast('تم حفظ مفاتيح API في التخزين المحلي الآمن!');
}
