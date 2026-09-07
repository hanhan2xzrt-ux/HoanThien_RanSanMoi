// ============================================================
// QUẢN LÝ TÀI KHOẢN
// ============================================================

// Lấy danh sách tất cả tài khoản
function layDanhSachTaiKhoan() {
    return JSON.parse(
        localStorage.getItem("danhSachTaiKhoanRan") || "[]"
    );
}

// Lưu danh sách tất cả tài khoản
function luuDanhSachTaiKhoan(danhSach) {
    localStorage.setItem(
        "danhSachTaiKhoanRan",
        JSON.stringify(danhSach)
    );
}

// Lấy tài khoản của người đang đăng nhập
function layTaiKhoan() {
    const tenDangNhap = sessionStorage.getItem("nguoiDungDangNhap");

    if (!tenDangNhap) {
        return null;
    }

    const danhSachTaiKhoan = layDanhSachTaiKhoan();

    return danhSachTaiKhoan.find(
        taiKhoan => taiKhoan.ten === tenDangNhap
    ) || null;
}

// Đăng nhập thành công
function dangNhapThanhCong(ten) {
    sessionStorage.setItem("dangNhapRan", "1");
    sessionStorage.setItem("nguoiDungDangNhap", ten);
}

// Đăng xuất
function dangXuat() {
    sessionStorage.removeItem("dangNhapRan");
    sessionStorage.removeItem("nguoiDungDangNhap");

    location.href = "index.html";
}

// Kiểm tra trạng thái đăng nhập
function kiemTraDangNhap() {
    const file =
        location.pathname.split("/").pop() || "index.html";

    const cacTrangCanDangNhap = [
        "home.html",
        "game.html",
        "history.html",
        "settings.html"
    ];

    if (
        cacTrangCanDangNhap.includes(file) &&
        sessionStorage.getItem("dangNhapRan") !== "1"
    ) {
        location.href = "index.html";
        return false;
    }

    return true;
}


// ============================================================
// KHỞI TẠO TRANG
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    if (!kiemTraDangNhap()) {
        return;
    }

    const f =
        location.pathname.split("/").pop() || "index.html";

    if (f === "index.html") {
        khoiTaoDangNhap();
    }

    if (f === "home.html") {
        khoiTaoNha();
    }

    if (f === "history.html") {
        khoiTaoLichSu();
    }

    if (f === "settings.html") {
        khoiTaoCaiDat();
    }

    if (f === "game.html") {
        khoiTaoGame();
    }

    apDungCaiDat();
});


// ============================================================
// ĐĂNG NHẬP / ĐĂNG KÝ
// ============================================================

function khoiTaoDangNhap() {
    const dn =
        document.getElementById("form-dang-nhap");

    const dk =
        document.getElementById("form-dang-ky");

    const kdn =
        document.getElementById("khu-chua-dang-nhap");

    const kdk =
        document.getElementById("khu-dang-ky");


    // Chuyển sang đăng ký
    document
        .getElementById("nut-chuyen-dang-ky")
        ?.addEventListener("click", () => {
            kdn.classList.add("an");
            kdk.classList.remove("an");
        });


    // Chuyển sang đăng nhập
    document
        .getElementById("nut-chuyen-dang-nhap")
        ?.addEventListener("click", () => {
            kdk.classList.add("an");
            kdn.classList.remove("an");
        });


    // --------------------------------------------------------
    // ĐĂNG KÝ
    // --------------------------------------------------------

    dk?.addEventListener("submit", e => {
        e.preventDefault();

        const ten =
            document
                .getElementById("ten-dang-ky")
                .value
                .trim();

        const m =
            document.getElementById(
                "mat-ma-dang-ky"
            ).value;

        const x =
            document.getElementById(
                "xac-nhan-mat-ma"
            ).value;

        const b =
            document.getElementById(
                "thong-bao-dang-ky"
            );


        // Kiểm tra tên
        if (!ten) {
            b.textContent =
                "Hãy nhập tên người dùng.";

            return;
        }


        // Kiểm tra mật mã
        if (!m) {
            b.textContent =
                "Hãy nhập mật mã.";

            return;
        }


        // Kiểm tra xác nhận mật mã
        if (m !== x) {
            b.textContent =
                "Mật mã nhập lại chưa giống nhau.";

            return;
        }


        // Lấy danh sách tài khoản hiện tại
        const danhSachTaiKhoan =
            layDanhSachTaiKhoan();


        // Kiểm tra tên đã tồn tại
        const tonTai =
            danhSachTaiKhoan.find(
                taiKhoan =>
                    taiKhoan.ten.toLowerCase() ===
                    ten.toLowerCase()
            );


        if (tonTai) {
            b.textContent =
                "Tên người dùng đã tồn tại!";

            return;
        }


        // Thêm tài khoản mới
        danhSachTaiKhoan.push({
            ten: ten,
            matMa: m
        });


        // Lưu danh sách tài khoản
        luuDanhSachTaiKhoan(
            danhSachTaiKhoan
        );


        b.textContent =
            "Đăng ký thành công.";


        // Chuyển sang đăng nhập
        setTimeout(() => {
            kdk.classList.add("an");
            kdn.classList.remove("an");

            document.getElementById(
                "ten-dang-nhap"
            ).value = ten;
        }, 500);
    });


    // --------------------------------------------------------
    // ĐĂNG NHẬP
    // --------------------------------------------------------

    dn?.addEventListener("submit", e => {
        e.preventDefault();

        const ten =
            document
                .getElementById("ten-dang-nhap")
                .value
                .trim();

        const m =
            document.getElementById(
                "mat-ma-dang-nhap"
            ).value;

        const b =
            document.getElementById(
                "thong-bao-dang-nhap"
            );


        // Lấy danh sách tài khoản
        const danhSachTaiKhoan =
            layDanhSachTaiKhoan();


        // Tìm tài khoản phù hợp
        const taiKhoan =
            danhSachTaiKhoan.find(
                taiKhoan =>
                    taiKhoan.ten.toLowerCase() ===
                        ten.toLowerCase() &&
                    taiKhoan.matMa === m
            );


        // Không có tài khoản
        if (!taiKhoan) {
            if (!danhSachTaiKhoan.length) {
                b.textContent =
                    "Chưa có tài khoản. Hãy đăng ký trước.";
            } else {
                b.textContent =
                    "Tên hoặc mật mã chưa đúng.";
            }

            return;
        }


        // Đăng nhập thành công
        dangNhapThanhCong(
            taiKhoan.ten
        );

        location.href = "home.html";
    });
}


// ============================================================
// ĐIỀU HƯỚNG
// ============================================================

function batDauGame() {
    if (
        sessionStorage.getItem("dangNhapRan") === "1"
    ) {
        location.href = "game.html";
    } else {
        location.href = "index.html";
    }
}


function veNha() {
    location.href = "home.html";
}


function thoatTroChoi() {
    clearInterval(timer);

    dangChay = false;

    location.href = "home.html";
}


// ============================================================
// TRANG NHÀ
// ============================================================

function khoiTaoNha() {
    const t = layTaiKhoan();

    const e =
        document.getElementById(
            "ten-nguoi-choi"
        );

    if (t && e) {
        e.textContent = t.ten;
    }
}


// ============================================================
// LỊCH SỬ TRÒ CHƠI
// ============================================================

function layKeyLichSu() {
    const taiKhoan = layTaiKhoan();

    if (!taiKhoan) {
        return null;
    }

    return "lichSuRan_" + taiKhoan.ten;
}


function khoiTaoLichSu() {
    const k =
        document.getElementById(
            "danh-sach-lich-su"
        );

    if (!k) {
        return;
    }


    const keyLichSu =
        layKeyLichSu();


    if (!keyLichSu) {
        k.innerHTML =
            '<div class="lich-su-rong">Chưa có ván chơi nào.</div>';

        return;
    }


    const a =
        JSON.parse(
            localStorage.getItem(
                keyLichSu
            ) || "[]"
        );


    if (!a.length) {
        k.innerHTML =
            '<div class="lich-su-rong">Chưa có ván chơi nào.</div>';

        return;
    }


    k.innerHTML =
        a.map((v, i) => `
            <div class="lich-su-item">
                <strong>Ván ${a.length - i}</strong>
                <span>Điểm: ${Number(v.diem) || 0}</span>
                <span>${v.ngay || ""} ${v.gio || ""}</span>
            </div>
        `).join("");
}


// ============================================================
// CÀI ĐẶT
// ============================================================

const MAC_DINH = {
    mauRan: "xanh-la",
    mauVuon: "xanh-bien",
    mauGiaoDien: "xanh-bien",
    doSang: 80,
    amThanh: true,
    amLuong: 35
};


function layCaiDat() {
    return {
        ...MAC_DINH,
        ...JSON.parse(
            localStorage.getItem(
                "caiDatRan"
            ) || "{}"
        )
    };
}


function luuCaiDat(c) {
    localStorage.setItem(
        "caiDatRan",
        JSON.stringify(c)
    );
}


function khoiTaoCaiDat() {
    const c = layCaiDat();

    for (
        const [id, v] of [
            ["chon-mau-ran", c.mauRan],
            ["chon-mau-vuon", c.mauVuon],
            ["chon-mau-giao-dien", c.mauGiaoDien],
            ["thanh-do-sang", c.doSang],
            ["thanh-am-luong", c.amLuong]
        ]
    ) {
        const e =
            document.getElementById(id);

        if (e) {
            e.value = v;
        }
    }

    capNhatNutCaiDat();
    capNhatMauMau();
}


function doiMauRan(v) {
    const c = layCaiDat();

    c.mauRan = v;

    luuCaiDat(c);
    apDungCaiDat();
    capNhatMauMau();
}


function doiMauVuon(v) {
    const c = layCaiDat();

    c.mauVuon = v;

    luuCaiDat(c);
    apDungCaiDat();
    capNhatMauMau();
}


function doiMauGiaoDien(v) {
    const c = layCaiDat();

    c.mauGiaoDien = v;

    luuCaiDat(c);
    apDungCaiDat();
    capNhatMauMau();
}


function doiDoSang(v) {
    const c = layCaiDat();

    c.doSang = Number(v);

    luuCaiDat(c);
    apDungCaiDat();
    capNhatNutCaiDat();
}


function doiCheDoSang() {
    const c = layCaiDat();

    c.doSang =
        Number(c.doSang) > 80
            ? 60
            : 105;

    luuCaiDat(c);

    const e =
        document.getElementById(
            "thanh-do-sang"
        );

    if (e) {
        e.value = c.doSang;
    }

    apDungCaiDat();
    capNhatNutCaiDat();
}


function doiAmThanh() {
    const c = layCaiDat();

    c.amThanh = !c.amThanh;

    luuCaiDat(c);
    capNhatNutCaiDat();
}


function doiAmLuong(v) {
    const c = layCaiDat();

    c.amLuong = Number(v);

    luuCaiDat(c);
}


function capNhatNutCaiDat() {
    const c = layCaiDat();

    const a =
        document.getElementById(
            "nut-am-thanh"
        );

    const b =
        document.getElementById(
            "chu-am-thanh"
        );

    const s =
        document.getElementById(
            "nut-do-sang"
        );

    const t =
        document.getElementById(
            "chu-do-sang"
        );


    if (a) {
        a.textContent =
            c.amThanh
                ? "Đang bật"
                : "Đã tắt";
    }


    if (b) {
        b.textContent =
            c.amThanh
                ? "Đang bật"
                : "Đã tắt";
    }


    const toi =
        Number(c.doSang) < 80;


    if (s) {
        s.textContent =
            toi
                ? "Tối"
                : "Sáng";
    }


    if (t) {
        t.textContent =
            toi
                ? "Tối"
                : "Sáng";
    }
}


function capNhatMauMau() {
    const c = layCaiDat();

    const a =
        document.getElementById(
            "mau-ran-mau"
        );

    const b =
        document.getElementById(
            "mau-vuon-mau"
        );

    const d =
        document.getElementById(
            "mau-giao-dien-mau"
        );


    if (a) {
        a.style.background =
            mauRan(c.mauRan);
    }


    if (b) {
        b.style.background =
            mauVuon(c.mauVuon);
    }


    if (d) {
        d.style.background =
            mauGiaoDien(c.mauGiaoDien);
    }
}


function mauRan(v) {
    return {
        tim: "#a66de8",
        do: "#e65757",
        cam: "#f28b35",
        vang: "#e7c84b",
        hong: "#ef72b7",
        "xanh-la": "#55c96a",
        "xanh-bien": "#4ca8e8",
        nau: "#a8754b",
        den: "#17191d",
        trang: "#f5f7f2"
    }[v] || "#55c96a";
}


function mauVuon(v) {
    return {
        tim: "#34234a",
        do: "#4a2024",
        cam: "#4b2b18",
        vang: "#4a4320",
        hong: "#4b2639",
        "xanh-la": "#173b2b",
        "xanh-bien": "#123b52",
        nau: "#493528",
        den: "#151719",
        trang: "#dfe5df"
    }[v] || "#123b52";
}


function mauGiaoDien(v) {
    return {
        tim: ["#4b3270", "#8a64bd"],
        do: ["#6b2930", "#b84b54"],
        cam: ["#70401f", "#c97532"],
        vang: ["#665b20", "#b8a33b"],
        hong: ["#6b3153", "#bd5d8c"],
        "xanh-la": ["#24533d", "#4d9a72"],
        "xanh-bien": ["#063b55", "#08708a"],
        nau: ["#543a2a", "#8d6449"],
        den: ["#111315", "#34393e"],
        trang: ["#cdd5d9", "#f1f5f4"]
    }[v] || ["#063b55", "#08708a"];
}


function apDungCaiDat() {
    const c = layCaiDat();

    const g =
        mauGiaoDien(
            c.mauGiaoDien
        );

    const sang =
        c.mauGiaoDien === "trang";


    document.documentElement.style.setProperty(
        "--ran",
        mauRan(c.mauRan)
    );

    document.documentElement.style.setProperty(
        "--vuon",
        mauVuon(c.mauVuon)
    );

    document.documentElement.style.setProperty(
        "--giao-dien-1",
        g[0]
    );

    document.documentElement.style.setProperty(
        "--giao-dien-2",
        g[1]
    );

    document.documentElement.style.setProperty(
        "--chu",
        sang
            ? "#172126"
            : "#edfaff"
    );

    document.documentElement.style.setProperty(
        "--chu-phu",
        sang
            ? "#45545b"
            : "#b9dce5"
    );

    document.documentElement.style.setProperty(
        "--the",
        sang
            ? "rgba(255,255,255,.78)"
            : "rgba(5,38,55,.72)"
    );

    document.documentElement.style.setProperty(
        "--vien",
        sang
            ? "rgba(20,40,45,.16)"
            : "rgba(255,255,255,.13)"
    );

    document.documentElement.style.setProperty(
        "--do-sang",
        Math.max(
            .45,
            Number(c.doSang) / 100
        )
    );
}


// ============================================================
// GAME
// ============================================================

let canvas,
    ctx,
    ran = [],
    huong = {
        x: 1,
        y: 0
    },
    huongTiepTheo = {
        x: 1,
        y: 0
    },
    moi = null,
    diem = 0,
    timer = null,
    dangChay = false,
    dangTamDung = false,
    gameKetThuc = false,
    touchX = 0,
    touchY = 0;


const SO_O = 25;
const TOC_DO = 175;


function khoiTaoGame() {
    canvas =
        document.getElementById(
            "man-hinh-game"
        );

    ctx =
        canvas?.getContext("2d");


    if (!canvas || !ctx) {
        return;
    }


    canvas.width = 750;
    canvas.height = 750;


    document.addEventListener(
        "keydown",
        xuLyPhim
    );


    canvas.addEventListener(
        "touchstart",
        e => {
            const t =
                e.changedTouches[0];

            touchX = t.clientX;
            touchY = t.clientY;
        },
        {
            passive: true
        }
    );


    canvas.addEventListener(
        "touchend",
        e => {
            const t =
                e.changedTouches[0];

            xuLyVuot(
                t.clientX - touchX,
                t.clientY - touchY
            );
        },
        {
            passive: true
        }
    );


    batDauVanMoi();
}


function batDauVanMoi() {
    clearInterval(timer);

    ran = [
        {
            x: 2,
            y: 2
        }
    ];

    huong = {
        x: 1,
        y: 0
    };

    huongTiepTheo = {
        x: 1,
        y: 0
    };

    diem = 0;

    dangChay = true;
    dangTamDung = false;
    gameKetThuc = false;


    document.getElementById(
        "diem"
    ).textContent = "0";


    document.getElementById(
        "nut-tam-dung"
    ).textContent = "Tạm dừng";


    document.getElementById(
        "man-choang"
    ).classList.add("an");


    document.getElementById(
        "khung-choi"
    ).classList.remove("choang");


    taoMoi();
    veGame();


    timer =
        setInterval(
            vongGame,
            TOC_DO
        );
}


function vongGame() {
    if (
        !dangChay ||
        dangTamDung ||
        gameKetThuc
    ) {
        return;
    }


    huong =
        huongTiepTheo;


    const d = ran[0];

    const n = {
        x: d.x + huong.x,
        y: d.y + huong.y
    };


    // Va tường
    if (
        n.x < 0 ||
        n.x >= SO_O ||
        n.y < 0 ||
        n.y >= SO_O
    ) {
        ketThucGame("tuong");
        return;
    }


    const an =
        moi &&
        n.x === moi.x &&
        n.y === moi.y;


    const check =
        an
            ? ran
            : ran.slice(0, -1);


    // Cắn vào thân
    if (
        check.some(
            x =>
                x.x === n.x &&
                x.y === n.y
        )
    ) {
        ketThucGame("than");
        return;
    }


    ran.unshift(n);


    if (an) {
        diem++;

        document.getElementById(
            "diem"
        ).textContent = diem;

        phatAmThanh("an");

        taoMoi();
    } else {
        ran.pop();
    }


    veGame();
}


// ============================================================
// ĐIỀU KHIỂN
// ============================================================

function xuLyPhim(e) {
    const p =
        e.key.toLowerCase();


    const b = {
        w: {
            x: 0,
            y: -1
        },

        a: {
            x: -1,
            y: 0
        },

        s: {
            x: 0,
            y: 1
        },

        d: {
            x: 1,
            y: 0
        },

        arrowup: {
            x: 0,
            y: -1
        },

        arrowleft: {
            x: -1,
            y: 0
        },

        arrowdown: {
            x: 0,
            y: 1
        },

        arrowright: {
            x: 1,
            y: 0
        }
    };


    if (b[p]) {
        e.preventDefault();
        doiHuong(b[p]);
    }
}


function xuLyVuot(dx, dy) {
    if (
        Math.max(
            Math.abs(dx),
            Math.abs(dy)
        ) < 25
    ) {
        return;
    }


    doiHuong(
        Math.abs(dx) > Math.abs(dy)
            ? (
                dx > 0
                    ? {
                        x: 1,
                        y: 0
                    }
                    : {
                        x: -1,
                        y: 0
                    }
            )
            : (
                dy > 0
                    ? {
                        x: 0,
                        y: 1
                    }
                    : {
                        x: 0,
                        y: -1
                    }
            )
    );
}


function doiHuong(h) {
    // Không cho quay đầu 180 độ
    if (
        h.x + huong.x === 0 &&
        h.y + huong.y === 0
    ) {
        return;
    }

    huongTiepTheo = h;
}


// ============================================================
// TẠO MỒI
// ============================================================

function taoMoi() {
    const a = [];


    // Mồi cách tường ít nhất 1 ô
    for (
        let y = 1;
        y < SO_O - 1;
        y++
    ) {
        for (
            let x = 1;
            x < SO_O - 1;
            x++
        ) {
            if (
                !ran.some(
                    d =>
                        d.x === x &&
                        d.y === y
                )
            ) {
                a.push({
                    x,
                    y
                });
            }
        }
    }


    moi =
        a.length
            ? a[
                Math.floor(
                    Math.random() *
                    a.length
                )
            ]
            : null;
}


// ============================================================
// VẼ GAME
// ============================================================

function boGoc(
    c,
    x,
    y,
    w,
    h,
    r
) {
    c.beginPath();

    c.roundRect(
        x,
        y,
        w,
        h,
        r
    );
}


function veGame() {
    const o =
        canvas.width / SO_O;

    const c =
        layCaiDat();


    // Nền vườn
    ctx.fillStyle =
        mauVuon(c.mauVuon);

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Lưới
    ctx.strokeStyle =
        "rgba(255,255,255,.035)";

    ctx.lineWidth = 1;


    for (
        let i = 0;
        i <= SO_O;
        i++
    ) {
        ctx.beginPath();

        ctx.moveTo(
            i * o,
            0
        );

        ctx.lineTo(
            i * o,
            canvas.height
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(
            0,
            i * o
        );

        ctx.lineTo(
            canvas.width,
            i * o
        );

        ctx.stroke();
    }


    // Trái tim
    if (moi) {
        veTim(
            moi.x * o + o / 2,
            moi.y * o + o / 2,
            o * .31
        );
    }


    // Thân rắn
    ran.forEach(
        (d, i) => {
            const x = d.x * o;
            const y = d.y * o;

            const bo =
                Math.max(
                    3,
                    o * .12
                );

            const size =
                o - bo * 2;


            ctx.fillStyle =
                mauRan(c.mauRan);

            ctx.shadowColor =
                "rgba(0,0,0,.24)";

            ctx.shadowBlur = 6;


            boGoc(
                ctx,
                x + bo,
                y + bo,
                size,
                size,
                o * .18
            );

            ctx.fill();


            ctx.shadowBlur = 0;


            ctx.strokeStyle =
                c.mauRan === "den"
                    ? "rgba(255,255,255,.65)"
                    : c.mauRan === "trang"
                        ? "rgba(20,30,30,.45)"
                        : "rgba(255,255,255,.12)";


            ctx.lineWidth = 2;


            boGoc(
                ctx,
                x + bo + 1,
                y + bo + 1,
                size - 2,
                size - 2,
                o * .18
            );

            ctx.stroke();


            // Điểm sáng trên thân
            ctx.fillStyle =
                "rgba(230,255,230,.2)";


            boGoc(
                ctx,
                x + bo + 3,
                y + bo + 3,
                size * .32,
                size * .18,
                4
            );

            ctx.fill();


            // Đầu rắn
            if (i === 0) {
                veDauRan(
                    x,
                    y,
                    o,
                    huong
                );
            }
        }
    );
}


// ============================================================
// ĐẦU RẮN
// ============================================================

function veDauRan(
    x,
    y,
    o,
    h
) {
    const cx =
        x + o / 2;

    const cy =
        y + o / 2;

    const goc =
        Math.atan2(
            h.y,
            h.x
        );


    ctx.save();

    ctx.translate(
        cx,
        cy
    );

    ctx.rotate(goc);


    ctx.fillStyle =
        mauRan(
            layCaiDat().mauRan
        );


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        o * .43,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Mắt
    ctx.fillStyle =
        "#173d22";

    ctx.beginPath();

    ctx.arc(
        o * .18,
        -o * .16,
        o * .065,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#fff";

    ctx.beginPath();

    ctx.arc(
        o * .195,
        -o * .18,
        o * .018,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Lưỡi
    ctx.strokeStyle =
        "#ef6b72";

    ctx.lineWidth =
        Math.max(
            2,
            o * .045
        );

    ctx.lineCap =
        "round";


    ctx.beginPath();

    ctx.moveTo(
        o * .39,
        0
    );

    ctx.lineTo(
        o * .62,
        0
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        o * .62,
        0
    );

    ctx.lineTo(
        o * .73,
        -o * .07
    );

    ctx.moveTo(
        o * .62,
        0
    );

    ctx.lineTo(
        o * .73,
        o * .07
    );

    ctx.stroke();


    ctx.restore();
}


// ============================================================
// TRÁI TIM
// ============================================================

function veTim(
    cx,
    cy,
    s
) {
    ctx.save();


    ctx.fillStyle =
        "#ff7180";

    ctx.shadowColor =
        "rgba(255,90,110,.65)";

    ctx.shadowBlur = 12;


    ctx.beginPath();


    const t =
        cy - s * .25;


    ctx.moveTo(
        cx,
        cy + s
    );


    ctx.bezierCurveTo(
        cx - s * 1.3,
        cy + s * .25,
        cx - s * .95,
        t - s * .75,
        cx - s * .4,
        t
    );


    ctx.bezierCurveTo(
        cx - s * .15,
        t - s * .35,
        cx,
        t - s * .05,
        cx,
        t + s * .2
    );


    ctx.bezierCurveTo(
        cx,
        t - s * .05,
        cx + s * .15,
        t - s * .35,
        cx + s * .4,
        t
    );


    ctx.bezierCurveTo(
        cx + s * .95,
        t - s * .75,
        cx + s * 1.3,
        cy + s * .25,
        cx,
        cy + s
    );


    ctx.fill();


    ctx.shadowBlur = 0;


    ctx.fillStyle =
        "rgba(255,255,255,.55)";


    ctx.beginPath();

    ctx.arc(
        cx - s * .35,
        cy - s * .05,
        s * .13,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();
}


// ============================================================
// KẾT THÚC GAME
// ============================================================

function ketThucGame(loai) {
    clearInterval(timer);

    dangChay = false;
    gameKetThuc = true;


    const kh =
        document.getElementById(
            "khung-choi"
        );

    const m =
        document.getElementById(
            "man-choang"
        );

    const t =
        document.getElementById(
            "tieu-de-ket-thuc"
        );

    const n =
        document.getElementById(
            "noi-dung-ket-thuc"
        );

    const i =
        document.getElementById(
            "bieu-tuong-ket-thuc"
        );


    kh.classList.remove(
        "choang",
        "nhay-do"
    );


    void kh.offsetWidth;


    // Va tường
    if (loai === "tuong") {
        i.textContent = "!";

        i.className =
            "bieu-tuong-ket-thuc bieu-tuong-choang";


        t.textContent =
            "Rắn bị choáng,";

        n.textContent =
            "Rắn cần nghỉ ngơi.";


        kh.classList.add(
            "choang"
        );


        // Hiệu ứng đúng 2 giây
        setTimeout(
            () =>
                kh.classList.remove(
                    "choang"
                ),
            2000
        );
    }


    // Cắn vào thân
    else {
        i.textContent = "×";

        i.className =
            "bieu-tuong-ket-thuc bieu-tuong-dau";


        t.textContent =
            "Rắn cắn nhầm,";

        n.textContent =
            "Rắn bị đau, Rắn đi nghỉ đây.";


        kh.classList.add(
            "nhay-do"
        );


        setTimeout(
            () =>
                kh.classList.remove(
                    "nhay-do"
                ),
            900
        );
    }


    m.classList.remove(
        "an"
    );


    luuLichSu();

    phatAmThanh(
        "thua"
    );
}


// ============================================================
// LƯU LỊCH SỬ
// ============================================================

function luuLichSu() {
    const taiKhoan =
        layTaiKhoan();


    if (!taiKhoan) {
        return;
    }


    const keyLichSu =
        "lichSuRan_" +
        taiKhoan.ten;


    const d = new Date();


    const a =
        JSON.parse(
            localStorage.getItem(
                keyLichSu
            ) || "[]"
        );


    a.unshift({
        diem,
        ngay:
            d.toLocaleDateString(
                "vi-VN"
            ),
        gio:
            d.toLocaleTimeString(
                "vi-VN"
            )
    });


    localStorage.setItem(
        keyLichSu,
        JSON.stringify(
            a.slice(0, 50)
        )
    );
}


// ============================================================
// CHƠI LẠI / TẠM DỪNG
// ============================================================

function choiLai() {
    batDauVanMoi();
}


function tamDung() {
    if (gameKetThuc) {
        return;
    }


    dangTamDung =
        !dangTamDung;


    document.getElementById(
        "nut-tam-dung"
    ).textContent =
        dangTamDung
            ? "Tiếp tục"
            : "Tạm dừng";
}


// ============================================================
// ÂM THANH
// ============================================================

let audioContext = null;


function phatAmThanh(loai) {
    const c =
        layCaiDat();


    if (
        !c.amThanh ||
        Number(c.amLuong) <= 0
    ) {
        return;
    }


    try {
        if (!audioContext) {
            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();
        }


        const o =
            audioContext.createOscillator();

        const g =
            audioContext.createGain();


        o.connect(g);
        g.connect(
            audioContext.destination
        );


        const v =
            Number(c.amLuong) / 100;


        g.gain.setValueAtTime(
            .045 * v,
            audioContext.currentTime
        );


        o.frequency.setValueAtTime(
            loai === "an"
                ? 520
                : 220,
            audioContext.currentTime
        );


        o.frequency.exponentialRampToValueAtTime(
            loai === "an"
                ? 760
                : 110,
            audioContext.currentTime + .18
        );


        o.start();


        g.gain.exponentialRampToValueAtTime(
            .001,
            audioContext.currentTime + .2
        );


        o.stop(
            audioContext.currentTime + .21
        );
    }

    catch (_) {
        // Trình duyệt không hỗ trợ âm thanh
    }
}