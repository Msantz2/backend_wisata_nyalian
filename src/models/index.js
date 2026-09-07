const { sequelize } = require('../config/database');

const KategoriDestinasi = require('./kategoriDestinasi.model');
const KategoriPaket = require('./kategoriPaket.model');
const Destinasi = require('./destinasi.model');
const Admin = require('./admin.model');
const PaketWisata = require('./paketWisata.model');
const PaketDestinasi = require('./paketDestinasi.model');
const Wisatawan = require('./wisatawan.model');
const BeritaDesa = require('./beritaDesa.model');
const GaleriFoto = require('./galeriFoto.model');
const KetersediaanKuota = require('./ketersediaanKuota.model');
const Reservasi = require('./reservasi.model');
const Pembayaran = require('./pembayaran.model');
const Tiket = require('./tiket.model');
const UlasanWisatawan = require('./ulasanWisatawan.model');

KategoriDestinasi.hasMany(Destinasi, { foreignKey: 'id_kategori', as: 'destinasi' });
Destinasi.belongsTo(KategoriDestinasi, { foreignKey: 'id_kategori', as: 'kategori' });

Destinasi.hasMany(GaleriFoto, { foreignKey: 'id_destinasi', as: 'galeri' });
GaleriFoto.belongsTo(Destinasi, { foreignKey: 'id_destinasi', as: 'destinasi' });

KategoriPaket.hasMany(PaketWisata, { foreignKey: 'id_kategori', as: 'paket' });
PaketWisata.belongsTo(KategoriPaket, { foreignKey: 'id_kategori', as: 'kategori_paket' });

PaketWisata.hasMany(PaketDestinasi, { foreignKey: 'id_paket', as: 'destinasi_links' });
PaketDestinasi.belongsTo(PaketWisata, { foreignKey: 'id_paket', as: 'paket' });

PaketDestinasi.belongsTo(Destinasi, { foreignKey: 'id_destinasi', as: 'destinasi' });
Destinasi.hasMany(PaketDestinasi, { foreignKey: 'id_destinasi', as: 'paket_links' });

Admin.hasMany(BeritaDesa, { foreignKey: 'id_admin', as: 'berita' });
BeritaDesa.belongsTo(Admin, { foreignKey: 'id_admin', as: 'admin' });

Admin.hasMany(Reservasi, { foreignKey: 'id_admin', as: 'reservasi' });
Reservasi.belongsTo(Admin, { foreignKey: 'id_admin', as: 'admin' });

PaketWisata.hasMany(KetersediaanKuota, { foreignKey: 'id_paket', as: 'kuota' });
KetersediaanKuota.belongsTo(PaketWisata, { foreignKey: 'id_paket', as: 'paket' });

PaketWisata.hasMany(Reservasi, { foreignKey: 'id_paket', as: 'reservasi' });
Reservasi.belongsTo(PaketWisata, { foreignKey: 'id_paket', as: 'paket' });

Wisatawan.hasMany(Reservasi, { foreignKey: 'id_wisatawan', as: 'reservasi' });
Reservasi.belongsTo(Wisatawan, { foreignKey: 'id_wisatawan', as: 'wisatawan' });

Reservasi.hasMany(Pembayaran, { foreignKey: 'id_reservasi', as: 'pembayaran' });
Pembayaran.belongsTo(Reservasi, { foreignKey: 'id_reservasi', as: 'reservasi' });

Reservasi.hasMany(Tiket, { foreignKey: 'id_reservasi', as: 'tiket' });
Tiket.belongsTo(Reservasi, { foreignKey: 'id_reservasi', as: 'reservasi' });

Reservasi.hasOne(UlasanWisatawan, { foreignKey: 'id_reservasi', as: 'ulasan' });
UlasanWisatawan.belongsTo(Reservasi, { foreignKey: 'id_reservasi', as: 'reservasi' });

module.exports = {
  sequelize,
  KategoriDestinasi,
  KategoriPaket,
  Destinasi,
  Admin,
  PaketWisata,
  PaketDestinasi,
  Wisatawan,
  BeritaDesa,
  GaleriFoto,
  KetersediaanKuota,
  Reservasi,
  Pembayaran,
  Tiket,
  UlasanWisatawan
};
