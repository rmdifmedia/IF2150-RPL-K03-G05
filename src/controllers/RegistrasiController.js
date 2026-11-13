const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Masyarakat = require('../models/Masyarakat');
const Akun = require('../models/Akun');
const fs = require('fs');
const path = require('path');
const Mitra = require('../models/MitraPengacara');

const WAJIB = ['ijazah', 'kta', 'sipa', 'bas'];
const OPSIONAL = ['ktp', 'cv'];

function hapusUpload(files){
    Object.values(files || {}).flat().forEach(f => fs.unlink(f.path, () => {}));
}

exports.tampilMasyarakat = (req, res) =>
    res.render('auth/registrasi-masyarakat', { lama: {} });

exports.prosesMasyarakat = (req, res) => {
    const daftarError = validationResult(req).array().map(e => e.msg);
    const { nama, username, noHp, email, kataSandi } = req.body;

    if(!daftarError.length){
        if(Akun.cariByEmail(email)) daftarError.push('Email sudah terdaftar');
        if(Masyarakat.IsUsnAda(username)) daftarError.push('Username sudah dipakai');
    }

    if(daftarError.length){
        return res.status(400).render('auth/registrasi-masyarakat', {
            lama: req.body,
            error: daftarError,
        });
    }

    Masyarakat.buat({
        nama,
        username,
        noHp: '+62' + noHp.replace(/^0/, ''),
        email,
        sandiHash: bcrypt.hashSync(kataSandi, 10),
    });

    req.flash('sukses', 'Registrasi berhasil, silahkan melakukan login');
    res.redirect('/login-masyarakat');
};

exports.tampilMitra = (req, res) => res.render('auth/registrasi-mitra', { lama: {} });

exports.prosesMitra = (req, res) => {
    const daftarError = validationResult(req).array().map(e => e.msg);
    const { nama, username, namaFirma, email, kataSandi } = req.body;
    const files = req.files || {};

    WAJIB.forEach(k => {
        if(!files[k]) daftarError.push(`Dokumen ${k.toUpperCase()} wajib diunggah`);
    });

    if (!daftarError.length){
        if(Akun.cariByEmail(email)) daftarError.push('Email sudah terdaftar');
        if(Mitra.IsUsnAda(username)) daftarError.push('Username sudah dipakai');
    }

    if(daftarError.length) {
        hapusUpload(files);
        return res.status(400).render('auth/registrasi-mitra', { lama: req.body, error:daftarError,});
    }

    const daftarDokumen = [...WAJIB, ...OPSIONAL]
        .filter(k => files[k])
        .map(k => ({
                jenis: k,
                namaAsli: files[k][0].originalname,
                namaTersimpan: files[k][0].filename,
        }));
    
        Mitra.daftar(
            { nama, username, namaFirma, email, sandiHash: bcrypt.hashSync(kataSandi, 10) },
            daftarDokumen
        );

        req.flash('sukses', 'Registrasi berhasil. Akunmu menunggu verifikasi admin.');
        res.redirect('/login');
};