const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const flash = require('express-flash');
const app = express();
const port = 3000;
const {
    TB_M_COMPANY,
    TB_M_PLANT,
    TB_M_SHOP,
    TB_M_LINE,
    TB_M_STATION,
    TB_M_FE,
    TB_M_WORK_SHIFT,
    TB_M_GROUP,
    TB_M_TICKET,
    TB_M_CM_STS,
    TB_M_FIX_CM_STS,
    TB_M_PROB_CAT,
    TB_M_USER,
    TB_M_ASSET,
    TB_R_PROBLEM,
    TB_R_CM,
    TB_R_KPI,
    TB_R_LTR
} = require("./models");
const { Op, literal, Sequelize, Model, DataTypes } = require("sequelize");
const moment = require('moment');
const currentDate = moment();
const { log } = require('console');
const sequelize = new Sequelize({
    username: 'postgres',
    password: 'gandi',
    database: 'kpi_presswelding',
    host: '127.0.0.1',
    dialect: 'postgres',
    port: 5432
});
TB_R_PROBLEM.hasOne(TB_R_CM, { foreignKey: 'BNF_TICKET_NO' });

app.use(session({
    secret: 'my-secret-key', // Ganti dengan kunci rahasia yang kuat
    resave: true,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.get('/dashboard', checkLoginStatus, async (req, res) => {
    try {
        const totalDataKPI = await TB_R_KPI.count();
        // Periksa dan update status CM
        const cmToUpdate = await TB_R_CM.findAll({
            where: {
                FIX_CM_PLAN: {
                    [Op.not]: null
                },
                FIX_CM_ACT: null,
                [Op.literal]: Sequelize.literal('DATE("TB_R_CM"."LAST_UPDATE_DT") != CURRENT_DATE') // Perubahan di sini
            }
        });
        console.log(cmToUpdate);

        for (const cm of cmToUpdate) {
            const currentDate = new Date();
            const planDate = new Date(cm.FIX_CM_PLAN);

            if (planDate >= currentDate) {
                await TB_R_CM.update({ FIX_CM_NM: 'On Progress' }, { where: { id: cm.id } });
            } else {
                await TB_R_CM.update({ FIX_CM_NM: 'Delay' }, { where: { id: cm.id } });
            }

            // Update LAST_UPDATE_DT
            await TB_R_CM.update({ LAST_UPDATE_DT: currentDate }, { where: { id: cm.id } });
        }
        const stations = await TB_M_STATION.findAll({
            attributes: ['STATION_NM']
        });

        const stationNames = stations.map(station => station.STATION_NM);

        const machines = await TB_M_FE.findAll({
            attributes: ['FE_NM']
        });

        const machineNames = machines.map(machine => machine.FE_NM);

        const totalProblems = await TB_R_PROBLEM.count();

        const numberOfDelayStatus = await TB_R_CM.count({
            where: { FIX_CM_NM: 'Delay' }
        });

        const numberOfOnProgressStatus = await TB_R_CM.count({
            where: { FIX_CM_NM: 'On Progress' }
        });

        const numberOfFixProblems = await TB_R_PROBLEM.count({
            where: { CM_STS: 'F' }
        });

        const numberOfTemporaryProblems = await TB_R_PROBLEM.count({
            where: { CM_STS: 'T' }
        });

        // Periksa apakah pengguna sudah login dengan memeriksa sesi user
        if (req.session.user) {
            const successMessage = req.flash('success');
            // Jika pengguna sudah login, tampilkan pesan selamat datang dengan nama pengguna
            res.render('dashboard', {
                USER_NM: req.session.user,
                SHOP_NM: req.session.shop,
                GROUP_NM: req.session.group,
                SITE_NM: req.session.site,
                stations: stationNames,
                machines: machineNames,
                totalProblems: totalProblems,
                numberOfDelayStatus: numberOfDelayStatus,
                numberOfOnProgressStatus: numberOfOnProgressStatus,
                numberOfFixProblems: numberOfFixProblems,
                numberOfTemporaryProblems: numberOfTemporaryProblems,
                totalDataKPI: totalDataKPI,
                successMessage
            });


        } else {
            // Jika pengguna belum login, arahkan kembali ke halaman login
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Gagal login ' + error);
        return res.status(500).send('Gagal login');
    }
});


app.get('/login', (req, res) => {
    const successMessage = req.flash('success');
    res.render('login', {
        successMessage
    });
});

function checkLoginStatus(req, res, next) {
    if (req.session.user, req.session.shop, req.session.group, req.session.site) {
        // Pengguna sudah login, izinkan akses ke halaman beranda.
        next();
    } else {
        // Pengguna belum login, arahkan kembali ke halaman login.
        res.redirect('/login');
    }
}

app.get('/register', (req, res) => {
    const successMessage = req.flash('success');
    res.render('register', {
        successMessage
    });
});

app.post('/submit-register', async (req, res) => {
    const formData = req.body;
    console.log(formData);
    await TB_M_USER.create(formData);
    req.flash('success', 'Account successfully registered!');
    res.redirect('/login');
});

// Saat pengguna berhasil login, set sesi pengguna dan tampilkan nama pengguna di pesan selamat datang.
// Gantilah ini dengan cara Anda mengatur sesi pengguna saat login.
app.post('/submit-login', async (req, res) => {
    const { USER_ID, PASSWORD } = req.body;

    try {
        const user = await TB_M_USER.findOne({
            where: {
                USER_ID: USER_ID,
                PASSWORD: PASSWORD
            }
        });
        if (!user) {
            // Jika pengguna tidak ditemukan atau PASSWORD salah, tampilkan pesan error atau alihkan kembali ke halaman login.
            res.render('login', { error: 'Username atau Password salah.' });
        } else {
            // Simpan nama pengguna di sesi
            req.session.user = user.USER_NM;
            req.session.shop = user.SHOP_NM
            req.session.group = user.GROUP_NM,
                req.session.site = user.SITE_NM
            // Redirect ke halaman dashboard
            res.redirect('/dashboard');
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.render('login', { error: 'Terjadi kesalahan saat login.' });
    }
});

app.post('/submit-problem', async (req, res) => {
    const { SITE_NM, SHOP_NM, GROUP_NM, PROBLEM_DT, SHIFT_CD, LINE_NM, STATION_NM, FE_NM, ERROR_CD, PROBLEM_DESCRIPTION } = req.body;
    let year = PROBLEM_DT.substring(2, 4)
    let month = PROBLEM_DT.substring(5, 7)
    let day = PROBLEM_DT.substring(8, 10)
    let formattedDate = day + month + year

    try {
        const site = await TB_M_PLANT.findOne({
            attributes: ['SITE_CD'],
            where: {
                SITE_NM: SITE_NM,
            },
        });

        if (!site) {
            res.send('Site not found.');
            return;
        }
        console.log(site);

        const shop = await TB_M_SHOP.findOne({
            attributes: ['SHOP_CD'],
            where: {
                SHOP_NM: SHOP_NM,
            },
        });

        if (!shop) {
            res.send('Shop not found.');
            return;
        }
        console.log(shop);

        const group = await TB_M_GROUP.findOne({
            attributes: ['GROUP_CD'],
            where: {
                GROUP_NM: GROUP_NM,
            },
        });

        if (!group) {
            res.send('Group not found.');
            return;
        }

        console.log(group);

        const line = await TB_M_LINE.findOne({
            attributes: ['LINE_CD'],
            where: {
                LINE_NM: LINE_NM,
            },
        });

        if (!line) {
            res.send('Line not found.');
            return;
        }

        console.log(line);

        const station = await TB_M_STATION.findOne({
            attributes: ['STATION_CD'],
            where: {
                STATION_NM: STATION_NM,
            },
        });

        if (!station) {
            res.send('Station not found.');
            return;
        }

        console.log(station);

        const fe = await TB_M_FE.findOne({
            attributes: ['FE_CD'],
            where: {
                FE_NM: FE_NM,
            },
        });

        if (!fe) {
            res.send('FE not found.');
            return;
        }

        console.log(fe);

        const user = await TB_M_USER.findOne({
            attributes: ['USER_ID'],
            where: {
                USER_NM: req.session.user,
            },
        });

        if (!user) {
            res.send('User not found.');
            return;
        }

        console.log(user);

        // Hitung jumlah masalah yang sudah ada untuk toko tertentu
        const existingProblems = await TB_R_PROBLEM.count({
            where: {
                SHOP_NM: SHOP_NM
            }
        });

        // Bentuk BNF_TICKET_NO
        const shopCodePart = shop.SHOP_CD; 
        const time = new Date(Date.now())
        const string = `${ time.getTime() }`
        const BNF_TICKET_NO = `${ string.slice(-8) }` + shopCodePart;

        // Mendapatkan COMPANY_CD (di default '4009')
        const COMPANY_CD = '4009';

        const ASSET_ID = `${COMPANY_CD}${site.SITE_CD}${shop.SHOP_CD}${line.LINE_CD}${station.STATION_CD}${fe.FE_CD}`;
        const asset = await TB_M_ASSET.findOne({
            attributes: ['ASSET_ID'],
            where: {
                ASSET_ID: ASSET_ID,
            },
        });

        if (!asset) {
            res.send('Asset not found.');
            return;
        }

        console.log(asset);

        const PRODUCTION_ID = `${formattedDate}_${shop.SHOP_CD}_${SHIFT_CD}_${group.GROUP_CD}`
        await TB_R_PROBLEM.create({
            BNF_TICKET_NO: BNF_TICKET_NO,
            PRODUCTION_ID: PRODUCTION_ID,
            PROBLEM_DT: PROBLEM_DT,
            SHOP_NM: SHOP_NM,
            SHIFT_CD: SHIFT_CD,
            GROUP_NM: GROUP_NM,
            ASSET_ID: ASSET_ID,
            USER_ID: user.USER_ID,
            TICKET_STS: 0

        });

        await TB_R_CM.create({
            BNF_TICKET_NO: BNF_TICKET_NO,
            ERROR_CD: ERROR_CD,
            PROBLEM_DESCRIPTION: PROBLEM_DESCRIPTION
        });

        const cmData = {
            BNF_TICKET_NO: BNF_TICKET_NO,
            PROBLEM_DT: PROBLEM_DT,
            SHOP_NM: SHOP_NM,
            SHIFT_CD: SHIFT_CD,
            GROUP_NM: GROUP_NM,
            LINE_NM: LINE_NM,
            STATION_NM: STATION_NM,
            FE_NM: FE_NM,
            ERROR_CD: ERROR_CD,
            PROBLEM_DESCRIPTION: PROBLEM_DESCRIPTION,
            USER_NM: req.session.user
        };

        let submittedData = req.session.submittedData || [];

        submittedData.push(cmData); // Tambahkan data baru ke array

        req.session.submittedData = submittedData; // Simpan array data yang sudah disubmit

        req.flash('success', 'Data successfully uploaded!');

        res.redirect('/dashboard');
    } catch (error) {
        // Tangani kesalahan jika ada
        console.error("Error during problem submission:", error);
        res.status(500).send('Internal Server Error');
    }
});

// Handler untuk menghandle POST request dari formulir
app.post('/submit-working-hour', async (req, res) => {
    const { SHOP_NM, GROUP_NM, DT, SHIFT_CD, LST, WH, WH_1C, WH_2A, WH_5A } = req.body;
    let year = DT.substring(2, 4);
    let month = DT.substring(5, 7);
    let day = DT.substring(8, 10);
    let formattedDate = day + month + year;

    try {
        // Cari shop_cd berdasarkan SHOP_NM
        const shop = await TB_M_SHOP.findOne({
            attributes: ['SHOP_CD'],
            where: {
                SHOP_NM: SHOP_NM,
            },
        });

        if (!shop) {
            res.send('Shop not found.');
            return;
        }

        // Cari group_cd berdasarkan GROUP_NM
        const group = await TB_M_GROUP.findOne({
            attributes: ['GROUP_CD'],
            where: {
                GROUP_NM: GROUP_NM,
            },
        });

        if (!group) {
            res.send('Group not found.');
            return;
        }

        const PRODUCTION_ID = `${formattedDate}_${shop.SHOP_CD}_${SHIFT_CD}_${group.GROUP_CD}`;

        // Cek apakah PRODUCTION_ID sudah ada di TB_R_KPI
        const existingKPI = await TB_R_KPI.findOne({
            where: {
                PRODUCTION_ID: PRODUCTION_ID,
            },
        });

        if (existingKPI) {
            res.send('Data with the same PRODUCTION_ID already exists.');
            return;
        }

        // Mengisi field EST di tabel TB_R_KPI
        const estSum = await TB_R_PROBLEM.sum('EST', {
            where: {
                PRODUCTION_ID: PRODUCTION_ID,
            },
        });

        // Mengisi field ESN di tabel TB_R_KPI
        const esnCount = await TB_R_PROBLEM.count({
            where: {
                PRODUCTION_ID: PRODUCTION_ID,
            },
        });

        // Mengisi field ESN SLTR di tabel TB_R_KPI
        const esnSltrCount = await TB_R_PROBLEM.count({
            where: {
                PRODUCTION_ID: PRODUCTION_ID,
                PROB_CAT_CD: 1,
            },
        });

        // Mengisi field ESN LTR di tabel TB_R_KPI
        const esnLtrCount = await TB_R_PROBLEM.count({
            where: {
                PRODUCTION_ID: PRODUCTION_ID,
                PROB_CAT_CD: 2,
            },
        });

        // Mengisi field ESN SMALL di tabel TB_R_KPI
        const esnSmallCount = await TB_R_PROBLEM.count({
            where: {
                PRODUCTION_ID: PRODUCTION_ID,
                PROB_CAT_CD: 3,
            },
        });

        // Mengisi field ESN REPEAT di tabel TB_R_KPI
        const esnRepeatCount = await TB_R_PROBLEM.count({
            where: {
                PRODUCTION_ID: PRODUCTION_ID,
                PROB_CAT_CD: 4,
            },
        });

        // Mengisi field SOLVED SLTR di tabel TB_R_KPI
        const solvedSltrCount = await TB_R_PROBLEM.count({
            where: {
                PRODUCTION_ID: PRODUCTION_ID,
                PROB_CAT_CD: 1,
                CM_STS: 'F',
            },
        });

        // Mengisi field SOLVED LTR di tabel TB_R_KPI
        const solvedLtrCount = await TB_R_PROBLEM.count({
            where: {
                PRODUCTION_ID: PRODUCTION_ID,
                PROB_CAT_CD: 2,
                CM_STS: 'F',
            },
        });

        // Mengisi field SOLVED SMALL di tabel TB_R_KPI
        const solvedSmallCount = await TB_R_PROBLEM.count({
            where: {
                PRODUCTION_ID: PRODUCTION_ID,
                PROB_CAT_CD: 3,
                CM_STS: 'F',
            },
        });

        // Mengisi field SOLVED REPEAT di tabel TB_R_KPI
        const solvedRepeatCount = await TB_R_PROBLEM.count({
            where: {
                PRODUCTION_ID: PRODUCTION_ID,
                PROB_CAT_CD: 4,
                CM_STS: 'F',
            },
        });

        // Gunakan shop_cd dan group_cd yang ditemukan untuk menyimpan data ke tabel TB_R_KPI
        await TB_R_KPI.create({
            PRODUCTION_ID: PRODUCTION_ID,
            SHOP_NM: SHOP_NM,
            GROUP_NM: GROUP_NM,
            SHIFT_CD: SHIFT_CD,
            DT: DT,
            LST: LST,
            WH: WH,
            WH_1C: WH_1C,
            WH_2A: WH_2A,
            WH_5A: WH_5A,
            EST: estSum,
            ESN: esnCount,
            ESN_SLTR: esnSltrCount,
            ESN_LTR: esnLtrCount,
            ESN_SMALL: esnSmallCount,
            ESN_REPEAT: esnRepeatCount,
            SOLVED_SLTR: solvedSltrCount,
            SOLVED_LTR: solvedLtrCount,
            SOLVED_SMALL: solvedSmallCount,
            SOLVED_REPEAT: solvedRepeatCount,
        });

        req.flash('success', 'Data successfully uploaded!');

        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Fungsi untuk menghitung nilai PROB_CAT_CD berdasarkan nilai EST
async function calculateProbCatCode(estValue, bnfTicketNo, problemDt, sequelize) {
    if (estValue >= 60) {
        return 1;
    } else if (estValue >= 10 && estValue < 60) {
        return 2;
    } else if (estValue >= 1 && estValue < 10) {
        const assetIdData = await TB_R_PROBLEM.findOne({
            attributes: ['ASSET_ID'],
            where: {
                BNF_TICKET_NO: bnfTicketNo,
            },
        });

        if (!assetIdData) {
            console.log('Data tidak ditemukan di TB_R_PROBLEM.');
            return;
        }

        const assetId = assetIdData.ASSET_ID;

        // Mendapatkan ERROR_CD dari TB_R_CM
        const errorCdData = await TB_R_CM.findOne({
            attributes: ['ERROR_CD'],
            where: {
                BNF_TICKET_NO: bnfTicketNo,
            },
        });

        if (!errorCdData) {
            console.log('Data tidak ditemukan di TB_R_CM.');
            return;
        }

        const errorCd = errorCdData.ERROR_CD;
        // Tambahkan logika tambahan
        const countSameWeekProblems = await TB_R_PROBLEM.count({
            where: {
                BNF_TICKET_NO: { [Op.ne]: bnfTicketNo }, // BNF_TICKET_NO harus berbeda
                ASSET_ID: assetId,
                PROBLEM_DT: {
                    [Op.gte]: moment(problemDt).startOf('week').toDate(),
                    [Op.lte]: moment(problemDt).endOf('week').toDate(),
                },
            },
            include: [
                {
                    model: TB_R_CM,
                    attributes: [],
                    where: {
                        BNF_TICKET_NO: { [Op.ne]: bnfTicketNo }, // BNF_TICKET_NO harus berbeda
                        ERROR_CD: errorCd,
                    },
                },
            ],
        });

        console.log('Hasil Hitungan:' + countSameWeekProblems);

        if (countSameWeekProblems >= 2) {
            return 4;
        } else {
            return 3;
        }
    }
}

app.post('/submit-cm', async (req, res) => {
    const {
        BNF_TICKET_NO,
        EST,
        CM_NM,
        TMP_CM,
        FIX_CM,
        FIX_CM_PLAN,
        FIX_CM_ACT,

    } = req.body;


    // Jika data sudah ada, update nilai Q1-Q6 di TB_R_LTR
    const problem = await TB_R_PROBLEM.findOne({
        where: {
            BNF_TICKET_NO
        }
    });

    console.log(problem, 'ini problem')


    const { PROBLEM_DT } = problem

    try {
        // Update TB_R_PROBLEM
        const updateDataTB_R_PROBLEM = {
            EST,
            CM_STS: CM_NM,
            TICKET_STS: 1,
            PROB_CAT_CD: await calculateProbCatCode(parseFloat(EST), BNF_TICKET_NO, PROBLEM_DT)
        };
        const whereConditionTB_R_PROBLEM = {
            BNF_TICKET_NO
        };

        await TB_R_PROBLEM.update(updateDataTB_R_PROBLEM, {
            where: whereConditionTB_R_PROBLEM
        });

        // Update TB_R_CM
        const updateDataTB_R_CM = {
            TMP_CM,
            FIX_CM,
            PROB_CAT_CD: await calculateProbCatCode(parseFloat(EST), BNF_TICKET_NO, PROBLEM_DT)
        };
        const whereConditionTB_R_CM = {
            BNF_TICKET_NO
        };

        // Validasi tanggal FIX_CM_PLAN dan FIX_CM_ACT
        if (isValidDate(FIX_CM_PLAN)) {
            updateDataTB_R_CM.FIX_CM_PLAN = FIX_CM_PLAN;
        }

        if (isValidDate(FIX_CM_ACT)) {
            updateDataTB_R_CM.FIX_CM_ACT = FIX_CM_ACT;
        }

        // Update LAST_UPDATE_DT and FIX_CM_NM based on CM_NM value
        const currentDate = new Date();
        const fixPlanDate = new Date(updateDataTB_R_CM.FIX_CM_PLAN);

        if (CM_NM === 'T') {
            updateDataTB_R_CM.LAST_UPDATE_DT = currentDate;

            // Cek apakah LAST_UPDATE_DT melewati FIX_CM_PLAN
            if (currentDate > fixPlanDate) {
                updateDataTB_R_CM.FIX_CM_NM = 'Delay';
            } else {
                updateDataTB_R_CM.FIX_CM_NM = 'On Progress';
            }
        } else if (CM_NM === 'F') {
            updateDataTB_R_CM.LAST_UPDATE_DT = currentDate;
            updateDataTB_R_CM.FIX_CM_NM = 'Solved';
        }

        await TB_R_CM.update(updateDataTB_R_CM, {
            where: whereConditionTB_R_CM
        });

        // Jika nilai EST lebih dari 10, cek apakah sudah ada data di TB_R_LTR
        if (parseFloat(EST) >= 10) {
            const ltrData = await TB_R_LTR.findOne({
                where: {
                    BNF_TICKET_NO
                }
            });

            if (ltrData) {
                console.log(problem, 'ini problem')
                const updateDataTB_R_LTR = {
                    Q1: req.body.Q1,
                    Q2: req.body.Q2,
                    Q3: req.body.Q3,
                    Q4: req.body.Q4,
                    Q5: req.body.Q5,
                    Q6: req.body.Q6,
                    PROBLEM_DT: problem.PROBLEM_DT
                };

                await TB_R_LTR.update(updateDataTB_R_LTR, {
                    where: {
                        BNF_TICKET_NO
                    }
                });
            } else {
                // Jika data belum ada, sisipkan baris baru ke TB_R_LTR
                await TB_R_LTR.create({
                    BNF_TICKET_NO,
                    PROBLEM_DT,
                    Q1: req.body.Q1,
                    Q2: req.body.Q2,
                    Q3: req.body.Q3,
                    Q4: req.body.Q4,
                    Q5: req.body.Q5,
                    Q6: req.body.Q6
                });
            }
        }

        req.flash('success', 'Data successfully uploaded!');
        res.redirect('/problem'); // Redirect ke halaman problem setelah pembaruan
    } catch (error) {
        console.error('Error during Counter Measure submission:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/submit-edit', async (req, res) => {
    const {
        BNF_TICKET_NO,
        EST,
        CM_NM,
        TMP_CM,
        FIX_CM,
        FIX_CM_PLAN,
        FIX_CM_ACT,
        PRODUCTION_ID
    } = req.body;

    console.log("FIX_CM_PLAN in submit-edit:", FIX_CM_PLAN);

    try {
        // Update TB_R_PROBLEM
        const probCatCodeTB_R_PROBLEM = await calculateProbCatCode(parseFloat(EST), BNF_TICKET_NO, req.body.PROBLEM_DT, sequelize);
        const updateDataTB_R_PROBLEM = {
            EST,
            CM_STS: CM_NM,
            TICKET_STS: 1,
            PROB_CAT_CD: probCatCodeTB_R_PROBLEM
        };
        const whereConditionTB_R_PROBLEM = {
            BNF_TICKET_NO
        };

        await TB_R_PROBLEM.update(updateDataTB_R_PROBLEM, {
            where: whereConditionTB_R_PROBLEM
        });

        // Update TB_R_CM
        const probCatCodeTB_R_CM = await calculateProbCatCode(parseFloat(EST), BNF_TICKET_NO, req.body.PROBLEM_DT, sequelize);
        const updateDataTB_R_CM = {
            TMP_CM,
            FIX_CM,
            PROB_CAT_CD: probCatCodeTB_R_CM
        };
        const whereConditionTB_R_CM = {
            BNF_TICKET_NO
        };

        console.log("FIX CM PLAN " + "=" + FIX_CM_PLAN);

        // Validasi tanggal FIX_CM_PLAN dan FIX_CM_ACT
        if (isValidDate(FIX_CM_PLAN)) {
            updateDataTB_R_CM.FIX_CM_PLAN = FIX_CM_PLAN;
        }

        if (isValidDate(FIX_CM_ACT)) {
            updateDataTB_R_CM.FIX_CM_ACT = FIX_CM_ACT;
        }
        const currentDate = new Date();
        if (CM_NM === 'F') {

            if (isValidDate(FIX_CM_ACT) && isValidDate(FIX_CM_PLAN)) {
                updateDataTB_R_CM.LAST_UPDATE_DT = currentDate;
                updateDataTB_R_CM.FIX_CM_NM = 'Solved';
                // Jika nilai dari calculateProbCatCode(parseFloat(EST)) bernilai 1
                if (probCatCodeTB_R_CM === 1) {
                    await TB_R_KPI.increment('SOLVED_SLTR', {
                        by: 1,
                        where: {
                            PRODUCTION_ID: { [Op.eq]: PRODUCTION_ID }
                        }
                    });
                }
                // Jika nilai dari calculateProbCatCode(parseFloat(EST)) bernilai 2
                else if (probCatCodeTB_R_CM === 2) {
                    await TB_R_KPI.increment('SOLVED_LTR', {
                        by: 1,
                        where: {
                            PRODUCTION_ID: { [Op.eq]: PRODUCTION_ID }
                        }
                    });
                }
                // Jika nilai dari calculateProbCatCode(parseFloat(EST)) bernilai 3
                else if (probCatCodeTB_R_CM === 3) {
                    await TB_R_KPI.increment('SOLVED_SMALL', {
                        by: 1,
                        where: {
                            PRODUCTION_ID: { [Op.eq]: PRODUCTION_ID }
                        }
                    });
                }
                // Jika nilai dari calculateProbCatCode(parseFloat(EST)) bernilai 4
                else if (probCatCodeTB_R_CM === 4) {
                    await TB_R_KPI.increment('SOLVED_REPEAT', {
                        by: 1,
                        where: {
                            PRODUCTION_ID: { [Op.eq]: PRODUCTION_ID }
                        }
                    });
                }
            }
        }

        await TB_R_CM.update(updateDataTB_R_CM, {
            where: whereConditionTB_R_CM
        });

        req.flash('success', 'Data successfully uploaded!');

        res.redirect('/problem'); // Redirect ke halaman problem setelah pembaruan
    } catch (error) {
        console.error('Error during Edit submission:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Fungsi untuk memeriksa apakah nilai adalah tanggal yang valid
function isValidDate(dateString) {
    const regexDate = /^\d{4}-\d{2}-\d{2}$/; // Format tanggal YYYY-MM-DD

    return regexDate.test(dateString);
}

// Fungsi untuk mendapatkan Line
async function getLine(assetId) {
    try {
        const lineCode = assetId.substring(10, 13);
        const line = await TB_M_LINE.findOne({
            attributes: ['LINE_NM'],
            where: {
                LINE_CD: lineCode,
            },
        });

        return line ? line.LINE_NM : 'Line Not Found';
    } catch (error) {
        console.error('Error getting Line:', error);
        return 'Error';
    }
}

// Fungsi untuk mendapatkan Station
async function getStation(assetId) {
    try {
        const stationCode = assetId.substring(13, 15);
        const station = await TB_M_STATION.findOne({
            attributes: ['STATION_NM'],
            where: {
                STATION_CD: stationCode,
            },
        });

        return station ? station.STATION_NM : 'Station Not Found';
    } catch (error) {
        console.error('Error getting Station:', error);
        return 'Error';
    }
}

// Fungsi untuk mendapatkan FE
async function getFE(assetId) {
    try {
        const feCode = assetId.substring(15, 18);
        const fe = await TB_M_FE.findOne({
            attributes: ['FE_NM'],
            where: {
                FE_CD: feCode,
            },
        });

        return fe ? fe.FE_NM : 'FE Not Found';
    } catch (error) {
        console.error('Error getting FE:', error);
        return 'Error';
    }
}

// Fungsi untuk mendapatkan Error Code
async function getErrorCode(ticketNo) {
    try {
        const cmData = await TB_R_CM.findOne({
            attributes: ['ERROR_CD'],
            where: {
                BNF_TICKET_NO: ticketNo,
            },
        });

        return cmData ? cmData.ERROR_CD : 'Error Code Not Found';
    } catch (error) {
        console.error('Error getting Error Code:', error);
        return 'Error';
    }
}

async function getTemporaryCM(ticketNo) {
    try {
        const cmData = await TB_R_CM.findOne({
            attributes: ['TMP_CM'],
            where: {
                BNF_TICKET_NO: ticketNo,
            },
        });

        return cmData ? cmData.TMP_CM : 'Temporary Counter Measure Not Found';
    } catch (error) {
        console.error('Error getting Error Code:', error);
        return 'Error';
    }
}

async function getFixCM(ticketNo) {
    try {
        const cmData = await TB_R_CM.findOne({
            attributes: ['FIX_CM'],
            where: {
                BNF_TICKET_NO: ticketNo,
            },
        });

        return cmData ? cmData.FIX_CM : 'Fix Counter Measure Not Found';
    } catch (error) {
        console.error('Error getting Error Code:', error);
        return 'Error';
    }
}

async function getFixCMPlan(ticketNo) {
    try {
        const cmData = await TB_R_CM.findOne({
            attributes: ['FIX_CM_PLAN'],
            where: {
                BNF_TICKET_NO: ticketNo,
            },
        });

        const fixCMPlan = cmData ? cmData.FIX_CM_PLAN : 'Fix CM Plan Not Found';


        return fixCMPlan;
    } catch (error) {
        console.error('Error getting Fix CM Plan:', error);
        return 'Error';
    }
}


async function getFixCMAction(ticketNo) {
    try {
        const cmData = await TB_R_CM.findOne({
            attributes: ['FIX_CM_ACT'],
            where: {
                BNF_TICKET_NO: ticketNo,
            },
        });

        return cmData ? cmData.FIX_CM_ACT : 'Fix CM Action Not Found';
    } catch (error) {
        console.error('Error getting Error Code:', error);
        return 'Error';
    }
}

// Fungsi untuk mendapatkan Problem Description
async function getProblemDescription(ticketNo) {
    try {
        const cmData = await TB_R_CM.findOne({
            attributes: ['PROBLEM_DESCRIPTION'],
            where: {
                BNF_TICKET_NO: ticketNo,
            },
        });

        return cmData ? cmData.PROBLEM_DESCRIPTION : 'Problem Description Not Found';
    } catch (error) {
        console.error('Error getting Problem Description:', error);
        return 'Error';
    }
}

async function getFixCMName(ticketNo) {
    try {
        const cmData = await TB_R_CM.findOne({
            attributes: ['FIX_CM_NM'],
            where: {
                BNF_TICKET_NO: ticketNo,
            },
        });

        return cmData ? cmData.FIX_CM_NM : 'Fix CM Name Not Found';
    } catch (error) {
        console.error('Error getting Fix CM Name:', error);
        return 'Error';
    }
}

// Fungsi untuk mendapatkan User
async function getUser(userId) {
    try {
        const user = await TB_M_USER.findOne({
            attributes: ['USER_NM'],
            where: {
                USER_ID: userId,
            },
        });

        return user ? user.USER_NM : 'User Not Found';
    } catch (error) {
        console.error('Error getting User:', error);
        return 'Error';
    }
}

// Fungsi untuk mendapatkan nilai Q1, Q2, Q3, Q4, Q5, dan Q6 dari tabel TB_R_LTR
async function getQValues(ticketNo) {
    try {
        const qValues = await TB_R_LTR.findOne({
            attributes: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
            where: {
                BNF_TICKET_NO: ticketNo,
            },
        });

        return {
            Q1: qValues ? qValues.Q1 : null,
            Q2: qValues ? qValues.Q2 : null,
            Q3: qValues ? qValues.Q3 : null,
            Q4: qValues ? qValues.Q4 : null,
            Q5: qValues ? qValues.Q5 : null,
            Q6: qValues ? qValues.Q6 : null,
        };
    } catch (error) {
        console.error('Error getting Q values:', error);
        return {
            Q1: null,
            Q2: null,
            Q3: null,
            Q4: null,
            Q5: null,
            Q6: null,
        };
    }
}

// Fungsi utama
app.get('/problem', checkLoginStatus, async (req, res) => {
    try {
        const problems = await TB_R_PROBLEM.findAll({
            attributes: ['BNF_TICKET_NO', 'PROBLEM_DT', 'SHOP_NM', 'SHIFT_CD', 'GROUP_NM', 'ASSET_ID', 'CM_STS', 'EST', 'USER_ID', 'PRODUCTION_ID']
        });

        const combinedData = await Promise.all(problems.map(async (problem) => {
            const ticketNo = problem.BNF_TICKET_NO;
            const line = await getLine(problem.ASSET_ID);
            const station = await getStation(problem.ASSET_ID);
            const fe = await getFE(problem.ASSET_ID);
            const errorCode = await getErrorCode(ticketNo);
            const problemDescription = await getProblemDescription(ticketNo);
            const user = await getUser(problem.USER_ID);
            const temporary = await getTemporaryCM(ticketNo);
            const fix = await getFixCM(ticketNo);
            const fixplan = await getFixCMPlan(ticketNo);
            const fixaction = await getFixCMAction(ticketNo);
            const fixcmname = await getFixCMName(ticketNo);
            const qValues = await getQValues(ticketNo);

            const problemDate = new Date(problem.PROBLEM_DT);
            const formattedProblemDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(problemDate);

            return {
                BNF_TICKET_NO: ticketNo,
                PROBLEM_DT: formattedProblemDate,
                SHOP_NM: problem.SHOP_NM,
                SHIFT_CD: problem.SHIFT_CD,
                GROUP_NM: problem.GROUP_NM,
                LINE_NM: line,
                STATION_NM: station,
                FE_NM: fe,
                ERROR_CD: errorCode,
                PROBLEM_DESCRIPTION: problemDescription,
                CM_STS: problem.CM_STS,
                EST: problem.EST,
                USER_NM: user,
                TMP_CM: temporary,
                FIX_CM: fix,
                FIX_CM_PLAN: fixplan,
                FIX_CM_ACT: fixaction,
                FIX_CM_NM: fixcmname,
                PRODUCTION_ID: problem.PRODUCTION_ID,
                ...qValues,
            };
        }));

        const successMessage = req.flash('success');
        res.render('problem', {
            USER_NM: req.session.user,
            combinedData: combinedData,
            successMessage
        });

    } catch (error) {
        console.error('Gagal mengambil data: ' + error);
        return res.status(500).send('Gagal mengambil data.');
    }
});

app.get('/fixproblem', checkLoginStatus, async (req, res) => {
    try {
        const problems = await TB_R_PROBLEM.findAll({
            attributes: ['BNF_TICKET_NO', 'PROBLEM_DT', 'SHOP_NM', 'SHIFT_CD', 'GROUP_NM', 'ASSET_ID', 'CM_STS', 'EST', 'USER_ID', 'PRODUCTION_ID'],
            where: {
                CM_STS: 'F'
            }
        });

        const combinedData = await Promise.all(problems.map(async (problem) => {
            const ticketNo = problem.BNF_TICKET_NO;
            const line = await getLine(problem.ASSET_ID);
            const station = await getStation(problem.ASSET_ID);
            const fe = await getFE(problem.ASSET_ID);
            const errorCode = await getErrorCode(ticketNo);
            const problemDescription = await getProblemDescription(ticketNo);
            const user = await getUser(problem.USER_ID);
            const temporary = await getTemporaryCM(ticketNo);
            const fix = await getFixCM(ticketNo);
            const fixplan = await getFixCMPlan(ticketNo);
            const fixaction = await getFixCMAction(ticketNo);
            const qValues = await getQValues(ticketNo);

            const problemDate = new Date(problem.PROBLEM_DT);
            const formattedProblemDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(problemDate);
            return {
                BNF_TICKET_NO: ticketNo,
                PROBLEM_DT: formattedProblemDate,
                SHOP_NM: problem.SHOP_NM,
                SHIFT_CD: problem.SHIFT_CD,
                GROUP_NM: problem.GROUP_NM,
                LINE_NM: line,
                STATION_NM: station,
                FE_NM: fe,
                ERROR_CD: errorCode,
                PROBLEM_DESCRIPTION: problemDescription,
                CM_STS: problem.CM_STS,
                EST: problem.EST,
                USER_NM: user,
                TMP_CM: temporary,
                FIX_CM: fix,
                FIX_CM_PLAN: fixplan,
                FIX_CM_ACT: fixaction,
                PRODUCTION_ID: problem.PRODUCTION_ID,
                ...qValues,
            };
        }));

        res.render('fixproblem', {
            USER_NM: req.session.user,
            combinedData: combinedData
        });

    } catch (error) {
        console.error('Gagal mengambil data: ' + error);
        return res.status(500).send('Gagal mengambil data.');
    }
});

app.get('/tmpproblem', checkLoginStatus, async (req, res) => {
    try {
        const problems = await TB_R_PROBLEM.findAll({
            attributes: ['BNF_TICKET_NO', 'PROBLEM_DT', 'SHOP_NM', 'SHIFT_CD', 'GROUP_NM', 'ASSET_ID', 'CM_STS', 'EST', 'USER_ID', 'PRODUCTION_ID'],
            where: {
                CM_STS: 'T'
            }
        });

        const combinedData = await Promise.all(problems.map(async (problem) => {
            const ticketNo = problem.BNF_TICKET_NO;
            const line = await getLine(problem.ASSET_ID);
            const station = await getStation(problem.ASSET_ID);
            const fe = await getFE(problem.ASSET_ID);
            const errorCode = await getErrorCode(ticketNo);
            const problemDescription = await getProblemDescription(ticketNo);
            const user = await getUser(problem.USER_ID);
            const temporary = await getTemporaryCM(ticketNo);
            const fix = await getFixCM(ticketNo);
            const fixplan = await getFixCMPlan(ticketNo);
            const fixaction = await getFixCMAction(ticketNo);
            const qValues = await getQValues(ticketNo);

            const problemDate = new Date(problem.PROBLEM_DT);
            const formattedProblemDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(problemDate);

            return {
                BNF_TICKET_NO: ticketNo,
                PROBLEM_DT: formattedProblemDate,
                SHOP_NM: problem.SHOP_NM,
                SHIFT_CD: problem.SHIFT_CD,
                GROUP_NM: problem.GROUP_NM,
                LINE_NM: line,
                STATION_NM: station,
                FE_NM: fe,
                ERROR_CD: errorCode,
                PROBLEM_DESCRIPTION: problemDescription,
                CM_STS: problem.CM_STS,
                EST: problem.EST,
                USER_NM: user,
                TMP_CM: temporary,
                FIX_CM: fix,
                FIX_CM_PLAN: fixplan,
                FIX_CM_ACT: fixaction,
                PRODUCTION_ID: problem.PRODUCTION_ID,
                ...qValues,
            };
        }));

        res.render('tmpproblem', {
            USER_NM: req.session.user,
            combinedData: combinedData
        });

    } catch (error) {
        console.error('Gagal mengambil data: ' + error);
        return res.status(500).send('Gagal mengambil data.');
    }
});

app.get('/delayproblem', checkLoginStatus, async (req, res) => {
    try {
        const problems = await TB_R_PROBLEM.findAll({
            attributes: ['BNF_TICKET_NO', 'PROBLEM_DT', 'SHOP_NM', 'SHIFT_CD', 'GROUP_NM', 'ASSET_ID', 'CM_STS', 'EST', 'USER_ID', 'PRODUCTION_ID']
        });

        const combinedData = await Promise.all(problems.map(async (problem) => {
            const ticketNo = problem.BNF_TICKET_NO;
            const line = await getLine(problem.ASSET_ID);
            const station = await getStation(problem.ASSET_ID);
            const fe = await getFE(problem.ASSET_ID);
            const errorCode = await getErrorCode(ticketNo);
            const problemDescription = await getProblemDescription(ticketNo);
            const user = await getUser(problem.USER_ID);
            const temporary = await getTemporaryCM(ticketNo);
            const fix = await getFixCM(ticketNo);
            const fixplan = await getFixCMPlan(ticketNo);
            const fixaction = await getFixCMAction(ticketNo);
            const fixcmname = await getFixCMName(ticketNo);
            const qValues = await getQValues(ticketNo);

            const problemDate = new Date(problem.PROBLEM_DT);
            const formattedProblemDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(problemDate);

            // Tambahkan filter untuk hanya menyertakan data dengan FIX_CM_NM 'Delay'
            if (fixcmname === 'Delay') {
                return {
                    BNF_TICKET_NO: ticketNo,
                    PROBLEM_DT: formattedProblemDate,
                    SHOP_NM: problem.SHOP_NM,
                    SHIFT_CD: problem.SHIFT_CD,
                    GROUP_NM: problem.GROUP_NM,
                    LINE_NM: line,
                    STATION_NM: station,
                    FE_NM: fe,
                    ERROR_CD: errorCode,
                    PROBLEM_DESCRIPTION: problemDescription,
                    CM_STS: problem.CM_STS,
                    EST: problem.EST,
                    USER_NM: user,
                    TMP_CM: temporary,
                    FIX_CM: fix,
                    FIX_CM_PLAN: fixplan,
                    FIX_CM_ACT: fixaction,
                    FIX_CM_NM: fixcmname,
                    PRODUCTION_ID: problem.PRODUCTION_ID,
                    ...qValues,
                };
            }
        }));

        // Hapus nilai null yang mungkin disebabkan oleh filter di atas
        const filteredData = combinedData.filter(data => data !== undefined);

        res.render('delayproblem', {
            USER_NM: req.session.user,
            combinedData: filteredData
        });

    } catch (error) {
        console.error('Gagal mengambil data: ' + error);
        return res.status(500).send('Gagal mengambil data.');
    }
});

app.get('/onprogresproblem', checkLoginStatus, async (req, res) => {
    try {
        const problems = await TB_R_PROBLEM.findAll({
            attributes: ['BNF_TICKET_NO', 'PROBLEM_DT', 'SHOP_NM', 'SHIFT_CD', 'GROUP_NM', 'ASSET_ID', 'CM_STS', 'EST', 'USER_ID', 'PRODUCTION_ID']
        });

        const combinedData = await Promise.all(problems.map(async (problem) => {
            const ticketNo = problem.BNF_TICKET_NO;
            const line = await getLine(problem.ASSET_ID);
            const station = await getStation(problem.ASSET_ID);
            const fe = await getFE(problem.ASSET_ID);
            const errorCode = await getErrorCode(ticketNo);
            const problemDescription = await getProblemDescription(ticketNo);
            const user = await getUser(problem.USER_ID);
            const temporary = await getTemporaryCM(ticketNo);
            const fix = await getFixCM(ticketNo);
            const fixplan = await getFixCMPlan(ticketNo);
            const fixaction = await getFixCMAction(ticketNo);
            const fixcmname = await getFixCMName(ticketNo);
            const qValues = await getQValues(ticketNo);

            const problemDate = new Date(problem.PROBLEM_DT);
            const formattedProblemDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(problemDate);

            // Tambahkan filter untuk hanya menyertakan data dengan FIX_CM_NM 'Delay'
            if (fixcmname === 'On Progress') {
                return {
                    BNF_TICKET_NO: ticketNo,
                    PROBLEM_DT: formattedProblemDate,
                    SHOP_NM: problem.SHOP_NM,
                    SHIFT_CD: problem.SHIFT_CD,
                    GROUP_NM: problem.GROUP_NM,
                    LINE_NM: line,
                    STATION_NM: station,
                    FE_NM: fe,
                    ERROR_CD: errorCode,
                    PROBLEM_DESCRIPTION: problemDescription,
                    CM_STS: problem.CM_STS,
                    EST: problem.EST,
                    USER_NM: user,
                    TMP_CM: temporary,
                    FIX_CM: fix,
                    FIX_CM_PLAN: fixplan,
                    FIX_CM_ACT: fixaction,
                    FIX_CM_NM: fixcmname,
                    PRODUCTION_ID: problem.PRODUCTION_ID,
                    ...qValues,
                };
            }
        }));

        // Hapus nilai null yang mungkin disebabkan oleh filter di atas
        const filteredData = combinedData.filter(data => data !== undefined);

        res.render('onprogresproblem', {
            USER_NM: req.session.user,
            combinedData: filteredData
        });

    } catch (error) {
        console.error('Gagal mengambil data: ' + error);
        return res.status(500).send('Gagal mengambil data.');
    }
});

app.get('/datakpi', checkLoginStatus, async (req, res) => {
    try {
        // Gantilah dengan kode yang sesuai untuk mengambil data KPI dari tabel TB_R_KPI
        const kpiData = await TB_R_KPI.findAll({
            attributes: ['DT', 'SHOP_NM', 'SHIFT_CD', 'GROUP_NM', 'EST', 'LST', 'ESN', 'WH', 'WH_1C', 'WH_2A', 'WH_5A']
        });

        // Memformat setiap tanggal (DT) sesuai dengan format 'YYYY-MM-DD'
        const formattedKpiData = kpiData.map(kpi => {
            const kpiDate = new Date(kpi.DT);
            const formattedKpiDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(kpiDate);

            return {
                DT: formattedKpiDate,
                SHOP_NM: kpi.SHOP_NM,
                SHIFT_CD: kpi.SHIFT_CD,
                GROUP_NM: kpi.GROUP_NM,
                EST: kpi.EST,
                LST: kpi.LST,
                ESN: kpi.ESN,
                WH: kpi.WH,
                WH_1C: kpi.WH_1C,
                WH_2A: kpi.WH_2A,
                WH_5A: kpi.WH_5A
            };
        });

        res.render('datakpi', {
            USER_NM: req.session.user,
            kpiData: formattedKpiData
        });
    } catch (error) {
        console.error('Gagal mengambil data KPI: ' + error);
        return res.status(500).send('Gagal mengambil data KPI.');
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error during logout:", err);
        }
        res.redirect('/login');
    });
});

app.get('/get-table-1', async (req, res) => {
    var data = await tabel_1.findAll();
    res.json(data);
});

app.get('/data-table', async (req, res) => {
    res.render('table1');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
