//gatau ya masih mau di modif
const db = require('../db/database')

const DasarHukum = {
    cariByKeyword(keyword){
        const kataKunci = keyword.trim();

        if(!kataKunci){
            return [];
        }

        const pola = `%${kataKunci}%`;

        const query = db.prepare(`
            SELECT
                idPasal,
                namaPeraturan,
                nomorPasal,
                isiPasal
            FROM DasarHukum
            WHERE 
                namaPeraturan LIKE ?
                OR nomorPasal LIKE ?
                OR isiPasal LIKE ?
            ORDER BY idPasal ASC
        `);

        return query.all(pola, pola, pola);

        },
        cariById(idPasal){
            const query = db.prepare(`
                SELECT 
                    idPasal,
                    namaPeraturan,
                    nomorPasal,
                    isiPasal
                FROM DasarHukum
                WHERE idPasal = ?
            `);

            return query.get(idPasal);
        }
};

module.exports = DasarHukum;