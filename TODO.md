# TODO List - Dockev Project

## ✅ Tamamlanan Özellikler

### Temel Yapı

- [x] Electron + React + TypeScript + Vite projesi kuruldu
- [x] Tailwind CSS entegre edildi
- [x] React Router entegre edildi
- [x] Page transitions eklendi

### UI Components

- [x] TitleBar component (minimize, maximize, close butonları)
- [x] Sidebar component (collapsible, kategori filtreleme)
- [x] ProjectCard component
- [x] AddProjectModal component
- [x] ProjectDetail component
- [x] PageTransition component

### Proje Yönetimi

- [x] Proje ekleme (folder seçimi)
- [x] Proje listeleme
- [x] Proje detay sayfası
- [x] Proje silme

### IDE Entegrasyonu

- [x] VS Code açma
- [x] Cursor açma
- [x] WebStorm açma
- [x] Terminal açma
- [x] Dev server çalıştırma (npm/yarn/pnpm)

### Git Entegrasyonu

- [x] Git branch gösterimi
- [x] Son commit bilgisi
- [x] Pending changes gösterimi
- [x] Değişen dosyalar listesi

### Modül Sistemi

- [x] Multi-module project desteği
- [x] Modül otomatik tespit
- [x] Modül ekleme/kaldırma
- [x] Modül bazlı IDE açma
- [x] Technology stack modüllerden çekiliyor

### Proje Detayları

- [x] package.json'dan bilgi çekme (name, description, version, author, license, repository, homepage)
- [x] README.md okuma ve gösterimi
- [x] Klasör istatistikleri (file size, file count, folder count, created date)
- [x] Dil tespiti (TypeScript, Python, Go, Rust, JavaScript)
- [x] Open Folder butonu

---

## 🚧 Yapılması Gerekenler

### Öncelikli Özellikler

#### 1. Placeholder Butonların İşlevselliği

- [x] **Config Butonu**: Proje konfigürasyon modalı
  - [x] Proje ayarları düzenleme
  - [x] Default IDE seçimi
  - [x] Dev server komutları özelleştirme
  - [x] Environment variables yönetimi
- [x] **Manage Tech Stack Butonu**: Technology stack yönetim modalı
  - [x] Teknoloji ekleme/kaldırma
  - [x] Versiyon bilgileri güncelleme
  - [x] Custom teknoloji ekleme
- [x] **View All Changes Butonu**: Git değişikliklerini detaylı göster
  - [x] Tüm değişen dosyaları listele
  - [x] Diff görüntüleme
  - [ ] Commit yapma özelliği (opsiyonel)

#### 2. Veri Kalıcılığı

- [x] Projeleri localStorage'a kaydetme
- [x] Proje ayarlarını kaydetme
- [x] Modül bilgilerini kaydetme
- [ ] Veri import/export özelliği

#### 3. Modül Yönetimi Geliştirmeleri

- [x] Modül düzenleme (isim, path değiştirme)
- [x] Modül birleştirme
- [x] Modül yeniden adlandırma
- [x] Modül için özel dev server komutları

#### 4. Arama ve Filtreleme

- [x] TitleBar'daki search bar işlevsel hale getir
- [x] Proje adına göre arama
- [x] Teknoloji stack'e göre filtreleme
- [x] Tag'lere göre filtreleme
- [ ] Tarih aralığına göre filtreleme

#### 5. Bildirimler ve Geri Bildirimler

- [ ] Toast notification sistemi
- [ ] Copy path için toast bildirimi
- [ ] Dev server başlatma bildirimi
- [ ] Hata mesajları için toast

---

### Orta Öncelikli Özellikler

#### 6. Proje İstatistikleri

- [ ] Son açılma zamanı gösterimi
- [ ] Toplam çalışma süresi takibi
- [ ] En çok kullanılan IDE istatistiği
- [ ] Proje aktivite grafiği

#### 7. Proje Ayarları

- [ ] Global ayarlar sayfası
- [ ] Tema seçimi (dark/light)
- [ ] IDE path'leri özelleştirme
- [ ] Git config ayarları

#### 8. Proje Kategorileri ve Tag'ler

- [ ] Kategori yönetimi
- [ ] Tag ekleme/düzenleme
- [ ] Renk kodlu kategoriler
- [ ] Kategori bazlı filtreleme

#### 9. Proje Arşivleme

- [ ] Proje arşivleme özelliği
- [ ] Arşivlenen projeleri görüntüleme
- [ ] Arşivden geri yükleme

#### 10. Proje Şablonları

- [ ] Proje şablonu oluşturma
- [ ] Şablondan proje oluşturma
- [ ] Popüler şablonlar

---

### Düşük Öncelikli / Gelecek Özellikler

#### 11. Docker Entegrasyonu

- [ ] Dockerfile tespiti
- [ ] Docker compose desteği
- [ ] Container başlatma/durdurma

#### 12. Proje Bağımlılıkları

- [ ] package.json dependencies analizi
- [ ] Eski/güvenlik açığı olan paketleri tespit
- [ ] Bağımlılık güncelleme önerileri

#### 13. Proje Dokümantasyonu

- [ ] README.md editörü
- [ ] Proje notları ekleme
- [ ] Changelog yönetimi

#### 14. Proje Paylaşımı

- [ ] Proje export/import
- [ ] Proje şablonu paylaşımı
- [ ] Team collaboration özellikleri

#### 15. Performans İyileştirmeleri

- [ ] Büyük projeler için lazy loading
- [ ] Virtual scrolling
- [ ] Cache mekanizması
- [ ] Background task'lar için worker threads

#### 16. Erişilebilirlik

- [ ] Keyboard shortcuts
- [ ] Screen reader desteği
- [ ] High contrast mode

#### 17. Çoklu Dil Desteği

- [ ] i18n entegrasyonu
- [ ] Türkçe/İngilizce dil desteği
- [ ] Dil seçimi ayarı

#### 18. Proje Yedekleme

- [ ] Otomatik yedekleme
- [ ] Yedekten geri yükleme
- [ ] Cloud sync (opsiyonel)

---

## 🐛 Bilinen Hatalar / İyileştirmeler

- [ ] Git status refresh mekanizması optimize edilmeli
- [ ] Büyük klasörlerde stats hesaplama performansı iyileştirilmeli
- [ ] Modül tespit algoritması daha akıllı hale getirilmeli
- [ ] Error handling iyileştirilmeli (daha kullanıcı dostu mesajlar)
- [ ] Loading states daha iyi gösterilmeli

---

## 📝 Notlar

- Proje şu anda localStorage kullanmıyor, her açılışta projeler sıfırlanıyor
- Modül sistemi çalışıyor ama modül bilgileri kalıcı değil
- Technology stack detection temel seviyede, daha fazla teknoloji desteği eklenebilir
- Git entegrasyonu read-only, commit yapma özelliği yok

---

## 🎯 Kısa Vadeli Hedefler (1-2 Hafta)

1. Placeholder butonların işlevselliğini tamamla
2. Veri kalıcılığı ekle (localStorage)
3. Search bar'ı işlevsel hale getir
4. Toast notification sistemi ekle
5. Modül düzenleme özelliği ekle

---

## 📅 Uzun Vadeli Hedefler (1-2 Ay)

1. Proje şablonları sistemi
2. Docker entegrasyonu
3. Proje istatistikleri ve analitik
4. Team collaboration özellikleri
5. Cloud sync desteği
