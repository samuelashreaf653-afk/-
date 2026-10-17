/* app.js */

const $ = (id) => document.getElementById(id);

const VIEWS = [
    { id: "studentProfile", icon: "👤", label: "الملف الشخصي" },
    { id: "departmentAndLevels", icon: "🏢", label: "القسم والمستويات الأكاديمية" },
    { id: "subjects", icon: "📚", label: "المواد الدراسية" },
    { id: "semesters", icon: "🗓️", label: "الفصول الدراسية وجداول المحاضرات" },
    { id: "registration", icon: "📌", label: "تسجيل المواد" },
    { id: "courses", icon: "🏅", label: "الدورات والشهادات" },
    { id: "attendance", icon: "✅", label: "سجل الحضور والغياب" }
];

function buildNav() {
    $("nav").innerHTML = VIEWS.map(
        (v) => `<button data-view="${v.id}">${v.icon}<span>${v.label}</span></button>`
    ).join("");
    $("nav").querySelectorAll("button").forEach((b) => (b.onclick = () => show(b.dataset.view)));
}

function show(viewId) {
    $("nav").querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.view === viewId));
    $("content").innerHTML = RENDER[viewId] ? RENDER[viewId]() : `<p>الصفحة قيد التحديث</p>`;
}

const RENDER = {
    studentProfile() {
        const s = DB.student;
        const d = DB.department;
        return `
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-icon">🎓</div><div class="stat-info"><b>الفرقة الثالثة</b><span>المستوى الحالي</span></div></div>
                <div class="stat-card"><div class="stat-icon">⭐</div><div class="stat-info"><b>3.68</b><span>المعدل التراكمي</span></div></div>
                <div class="stat-card"><div class="stat-icon">📚</div><div class="stat-info"><b>${DB.subjects.length}</b><span>المواد الدراسية</span></div></div>
            </div>
            <div class="full-card">
                <div class="card-header">معلومات الطالب الأكاديمية</div>
                <div class="table-wrap"><table>
                    <tr><td style="width:220px; font-weight:600;">الرقم الجامعي</td><td><b>${s.Student_id}</b></td></tr>
                    <tr><td style="font-weight:600;">اسم الطالب</td><td>${s.Student_name}</td></tr>
                    <tr><td style="font-weight:600;">النوع</td><td>${s.gender}</td></tr>
                    <tr><td style="font-weight:600;">البريد الإلكتروني</td><td>${s.email}</td></tr>
                    <tr><td style="font-weight:600;">القسم التخصصي</td><td><span class="badge blue">${d.Department_name}</span></td></tr>
                </table></div>
            </div>`;
    },

    departmentAndLevels() {
        const d = DB.department;
        return `
            <div class="full-card">
                <div class="card-header">القسم الأكاديمي (قسم الطالب الوحيد)</div>
                <div class="table-wrap" style="margin-bottom:24px;"><table>
                    <thead><tr><th>كود القسم</th><th>اسم القسم التخصصي</th><th>رئيس القسم</th></tr></thead>
                    <tbody>
                        <tr>
                            <td><span class="badge blue">${d.code}</span></td>
                            <td><b>${d.Department_name}</b></td>
                            <td>${d.head}</td>
                        </tr>
                    </tbody>
                </table></div>

                <div class="card-header">المستويات الأكاديمية ومشاريع التخرج</div>
                <div class="table-wrap"><table>
                    <thead><tr><th>المستوى / الفرقة</th><th>حالة الطالب</th><th>ملاحظات ومتطلبات التخرج</th></tr></thead>
                    <tbody>
                        ${DB.levels.map(l => `
                            <tr>
                                <td><b>${l.Level_name}</b></td>
                                <td>
                                    ${l.status === 'completed' ? '<span class="badge green">✓ تم إنجازها</span>' : 
                                        l.status === 'current' ? '<span class="badge gold">★ أنت هنا (الحالية)</span>' : 
                                        '<span class="badge blue">قادمة</span>'}
                                </td>
                                <td>${l.note}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table></div>
            </div>`;
    },

    subjects() {
        const firstTerm = DB.subjects.filter(s => s.term === "First");
        const secondTerm = DB.subjects.filter(s => s.term === "Second");
        return `
            <div class="full-card">
                <div class="card-header">المواد الدراسية - الفصل الدراسي الأول</div>
                <div class="table-wrap" style="margin-bottom:20px;"><table style="margin-bottom:0;">
                    <thead><tr><th>كود المادة</th><th>اسم المادة</th><th>الساعات</th><th>أستاذ المحاضرة (الدكتور)</th><th>المعيد المسئول</th></tr></thead>
                    <tbody>${firstTerm.map(s => `<tr><td><b>#${s.Subject_id}</b></td><td>${s.Subject_Name}</td><td><span class="badge gold">${s.Credits} ساعات</span></td><td>${s.prof}</td><td>${s.ta}</td></tr>`).join('')}</tbody>
                </table></div>

                <div class="card-header" style="margin-top:20px;">المواد الدراسية - الفصل الدراسي الثاني</div>
                <div class="table-wrap"><table style="margin-bottom:0;">
                    <thead><tr><th>كود المادة</th><th>اسم المادة</th><th>الساعات</th><th>أستاذ المحاضرة (الدكتور)</th><th>المعيد المسئول</th></tr></thead>
                    <tbody>${secondTerm.map(s => `<tr><td><b>#${s.Subject_id}</b></td><td>${s.Subject_Name}</td><td><span class="badge gold">${s.Credits} ساعات</span></td><td>${s.prof}</td><td>${s.ta}</td></tr>`).join('')}</tbody>
                </table></div>
            </div>`;
    },

    semesters() {
        return `
            <div class="full-card">
                <div class="card-header">الفصول الدراسية وجداول المحاضرات المباشرة</div>
                
                <!-- ترم أول (عرض جدول واحد فقط تفصيلي دون أي تكرار) -->
                <div style="margin-bottom:30px; border-bottom:1px solid var(--border-color); padding-bottom:24px;">
                    <h3 style="font-size:16px; color:var(--navy-dark); margin-bottom:4px;">الفصل الدراسي الأول (معرف: #101)</h3>
                    <p style="font-size:13px; color:var(--text-muted); margin-bottom:16px;">من تاريخ: 2026-09-20 إلى تاريخ: 2027-01-15</p>
                    
                    <h4 style="font-size:14px; color:var(--navy-primary); margin-bottom:12px;">جدول المحاضرات والسكاشن التفصيلي (ترم أول)</h4>
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>اليوم</th>
                                    <th>اسم المادة</th>
                                    <th>المحاضرة (الدكتور / التوقيت / القاعة)</th>
                                    <th>السكشن (المعيد / التوقيت / المعمل)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${DB.fullWeeklySchedule.map(sch => `
                                    <tr>
                                        <td><b>${sch.day}</b></td>
                                        <td><b>${sch.subject}</b></td>
                                        <td>
                                            <span class="badge blue">محاضرة</span>
                                            <div>${sch.lecture.who}</div>
                                            <div class="sub-line">${sch.lecture.time} · ${sch.lecture.hall}</div>
                                        </td>
                                        <td>
                                            <span class="badge gold">سكشن</span>
                                            <div>${sch.section.who}</div>
                                            <div class="sub-line">${sch.section.time} · ${sch.section.hall}</div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- ترم تاني -->
                <div>
                    <h3 style="font-size:16px; color:var(--navy-dark); margin-bottom:4px;">الفصل الدراسي الثاني (معرف: #102)</h3>
                    <p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">من تاريخ: 2027-02-10 إلى تاريخ: 2027-06-05</p>
                    <div style="background:#f8fafc; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:24px; text-align:center;">
                        <p style="font-weight:700; color:var(--text-muted); font-size:15px;">غير متاح حالياً (لأننا لا زلنا في الفصل الدراسي الأول)</p>
                    </div>
                </div>
            </div>`;
    },

    registration() {
        const t1 = DB.registrations[0];
        const t2 = DB.registrations[1];
        return `
            <div class="full-card">
                <div class="card-header">تسجيل المواد الدراسية للعام الجامعي</div>
                
                <!-- ترم اول -->
                <div style="margin-bottom:24px;">
                    <h3 style="font-size:15px; color:var(--navy-dark); margin-bottom:6px;">${t1.term_name}</h3>
                    <p style="font-size:13px; color:var(--gold-accent); font-weight:600; margin-bottom:4px;">ميعاد التسجيل وأخر موعد: ${t1.period}</p>
                    <p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">الحالة: <span class="badge green">${t1.status}</span></p>
                    <div class="table-wrap"><table style="margin-bottom:0;">
                        <thead><tr><th>كود المادة (ID)</th><th>اسم المادة</th><th>الترم</th></tr></thead>
                        <tbody>${t1.subjects.map(sub => `<tr><td><span class="badge blue">#${sub.id}</span></td><td><b>${sub.name}</b></td><td>الترم الأول</td></tr>`).join('')}</tbody>
                    </table></div>
                </div>

                <!-- ترم تاني -->
                <div>
                    <h3 style="font-size:15px; color:var(--navy-dark); margin-bottom:6px;">${t2.term_name}</h3>
                    <p style="font-size:13px; color:var(--text-muted); font-weight:600; margin-bottom:4px;">ميعاد التسجيل: ${t2.period}</p>
                    <p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">الحالة: <span class="badge red">${t2.status}</span></p>
                    <div class="table-wrap"><table style="margin-bottom:0;">
                        <thead><tr><th>كود المادة (ID)</th><th>اسم المادة</th><th>الترم</th></tr></thead>
                        <tbody>${t2.subjects.map(sub => `<tr><td><span class="badge blue">#${sub.id}</span></td><td><b>${sub.name}</b></td><td>الترم الثاني</td></tr>`).join('')}</tbody>
                    </table></div>
                </div>
            </div>`;
    },

    courses() {
        return `
            <div class="full-card">
                <div class="card-header">الدورات التدريبية المتاحة للحجز والتطوير المهني</div>
                <div class="courses-grid" style="margin-bottom:28px;">
                    ${DB.courses.map((c, idx) => {
                        const shortDesc = c.description.substring(0, 70) + "...";
                        return `
                            <div class="course-box">
                                <div>
                                    <span class="badge blue">كورس معتمد</span>
                                    <h4 style="margin-top:10px;">${c.courses_title}</h4>
                                    <p class="course-desc" id="desc-${idx}">${shortDesc}</p>
                                    <button class="read-more-btn" onclick="toggleDesc(${idx})">قراءة المزيد (Read More)</button>
                                    <div class="instructor-info">
                                        <b>المحاضر:</b> ${c.instructor}<br/>
                                        <span style="font-size:11px; opacity:0.8;">(${c.externalNote})</span>
                                    </div>
                                    <p style="font-size:12px; color:var(--gold-accent); margin-bottom:8px;">★ ${c.Certification}</p>
                                </div>
                                <div class="course-footer">
                                    <span class="course-price">${c.Cost} جنيه</span>
                                    <button class="btn" style="padding:8px 16px; font-size:13px;" onclick="alert('تم تسجيل طلب حجز الكورس بنجاح!')">حجز الكورس</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="card-header">الكورسات التي أنجزتها والشهادات المتاحة للتحميل</div>
                <div class="table-wrap"><table style="margin-bottom:0;">
                    <thead><tr><th>اسم الكورس</th><th>تاريخ الإنجاز</th><th>الشهادة</th></tr></thead>
                    <tbody>
                        ${DB.completedCourses.map(cc => `
                            <tr>
                                <td><b>${cc.courses_title}</b></td>
                                <td>${cc.completion_date}</td>
                                <td><a href="#" class="badge green" style="text-decoration:none;" onclick="alert('جاري تحميل الشهادة بصيغة PDF...'); return false;">📥 تحميل الشهادة</a></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table></div>
            </div>`;
    },

    attendance() {
        return `
            <div class="full-card">
                <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
                    <span>سجل الحضور والغياب لجميع محاضرات الترم</span>
                    <span class="badge red" style="font-size:13px;">نسبة الغياب القصوى المسموحة: ${DB.maxAllowedAbsentRate}</span>
                </div>
                <div class="table-wrap"><table style="margin-bottom:0;">
                    <thead><tr><th>رقم المحاضرة</th><th>اسم المادة الدراسية</th><th>تاريخ المحاضرة</th><th>حالة الحضور</th></tr></thead>
                    <tbody>
                        ${DB.attendanceRecords.map(a => `
                            <tr>
                                <td><b>محاضرة رقم ${a.lecture_no}</b></td>
                                <td>${a.subject}</td>
                                <td>${a.date}</td>
                                <td>
                                    ${a.status === 'حاضر' ? '<span class="badge green">حاضر</span>' : '<span class="badge red">غائب</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table></div>
            </div>`;
    }
};

window.toggleDesc = function(idx) {
    const descEl = document.getElementById(`desc-${idx}`);
    const courses = DB.courses;
    if (descEl.dataset.expanded === "true") {
        descEl.textContent = courses[idx].description.substring(0, 70) + "...";
        descEl.dataset.expanded = "false";
        event.target.textContent = "قراءة المزيد (Read More)";
    } else {
        descEl.textContent = courses[idx].description;
        descEl.dataset.expanded = "true";
        event.target.textContent = "إخفاء التفاصيل";
    }
};

function enterPortal(s) {
    $("loginView").classList.add("hidden");
    $("portalView").classList.remove("hidden");
    $("welcome").textContent = `أهلاً بك، ${s.Student_name} 👋`;
    $("welcomeSub").textContent = `نظم معلومات الأعمال (BIS) · الفرقة الثالثة`;
    $("avatar").textContent = s.Student_name.charAt(0);
    buildNav();
    show("studentProfile");
}

$("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const inputVal = $("studentId").value.trim();
    const passVal = $("password").value;

    if ((inputVal === "student" || inputVal === "20230145") && passVal === "1234") {
        $("loginError").textContent = "";
        enterPortal(DB.student);
    } else {
        $("loginError").textContent = "الرقم الجامعي أو كلمة المرور غير صحيحة.";
    }
});

$("logoutBtn").onclick = () => {
    $("portalView").classList.add("hidden");
    $("loginView").classList.remove("hidden");
    $("password").value = "";
};
