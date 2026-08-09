import { InstitutionalPreset } from '../types';

export const INSTITUTIONAL_PRESETS: InstitutionalPreset[] = [
  {
    id: 'anaokulu',
    name: '🏫 Anaokulu & Kreş',
    description: 'Neşeli, velilere güven veren pastel tasarım, yemek menüsü ve ön kayıt formu.',
    badgeText: 'Milli Eğitim Bakanlığı Onaylı Özel Anaokulu',
    suggestedTheme: 'sunshine_warm',
    defaultBio: '03-06 Yaş Montessori & Çift Dilli Eğitici Anaokulu. Oyunla öğrenen, meraklı ve mutlu nesiller yetiştiriyoruz! 🎈✨',
    suggestedLinks: [
      {
        title: '📋 Veli Ön Kayıt & Randevu Formu',
        subtitle: 'Okulumuzu gezmek ve kontenjan bilgisi almak için form doldurun',
        url: '#lead-form',
        iconType: 'form',
        colorTheme: 'rose',
        badgeText: 'Ücretsiz Randevu',
        actionType: 'leadForm',
      },
      {
        title: '🥗 Haftalık Yemek Menüsü & Beslenme',
        subtitle: 'Diyetisyen onaylı organık haftalık yemek listemiz',
        url: '#weekly-menu',
        iconType: 'menu',
        colorTheme: 'amber',
        badgeText: 'Güncellendi',
        actionType: 'weeklyMenu',
      },
      {
        title: '💬 WhatsApp Veli İletişim Hattı',
        subtitle: 'Hızlı soru, servis bilgisi ve kayıt görüşmesi için yazın',
        url: 'https://wa.me/905000000000',
        iconType: 'whatsapp',
        colorTheme: 'emerald',
      },
      {
        title: '📸 Instagram Etkinlik Galerimiz',
        subtitle: 'Günlük atölyeler ve çocuk aktivitelerimizden anlar',
        url: 'https://instagram.com',
        iconType: 'instagram',
        colorTheme: 'violet',
      },
      {
        title: '📍 Okul Adresi & Yol Tarifi',
        subtitle: 'Google Maps ile okulumuzu ziyaret edin',
        url: 'https://maps.google.com',
        iconType: 'map',
        colorTheme: 'indigo',
      }
    ]
  },
  {
    id: 'kolej',
    name: '🎓 Kolej & Özel Okul',
    description: 'Prestijli kurumsal görünüm, bursluluk sınavı, akademik takvim ve kampüs turları.',
    badgeText: '2026-2027 Erken Kayıt Dönemi Başladı',
    suggestedTheme: 'royal_indigo',
    defaultBio: 'Anaokulu, İlkokul, Ortaokul & Lise. Geleceğin liderlerini dünya standartlarında multidisipliner eğitimle yetiştiriyoruz. 🏛️🌟',
    suggestedLinks: [
      {
        title: '📝 Bursluluk & Kabul Sınavı Başvurusu',
        subtitle: '%100\'e varan eğitim bursu fırsatı için hemen kaydolun',
        url: '#lead-form',
        iconType: 'calendar',
        colorTheme: 'indigo',
        badgeText: 'Erken Kayıt',
        actionType: 'leadForm',
      },
      {
        title: '💬 Veli Danışma & Aday Kayıt Hattı',
        subtitle: 'Eğitim uzmanlarımızla canlı görüşme başlatın',
        url: 'https://wa.me/905000000000',
        iconType: 'whatsapp',
        colorTheme: 'emerald',
      },
      {
        title: '🏫 Kampüsümüzü Sanal Turla Gezin',
        subtitle: 'Laboratuvarlar, spor alanları ve derslikleri keşfedin',
        url: 'https://youtube.com',
        iconType: 'youtube',
        colorTheme: 'rose',
      },
      {
        title: '📅 2026 Akademik Takvim & Duyurular',
        subtitle: 'Sınav tarihleri, kulüp çalışmaları ve etkinlikler',
        url: '#academic-calendar',
        iconType: 'menu',
        colorTheme: 'blue',
      },
      {
        title: '📍 Kampüs İletişim & Lokasyon',
        subtitle: 'Kampüsümüze yol tarifi alın ve randevu oluşturun',
        url: 'https://maps.google.com',
        iconType: 'map',
        colorTheme: 'slate',
      }
    ]
  },
  {
    id: 'atolye',
    name: '🎨 Çocuk Atölyesi & Oyun Grubu',
    description: 'Dinamik, seans takvimli, doğum günü rezervasyonlu ve renkli biletleme tasarımı.',
    badgeText: 'Hafta Sonu Atölye Kayıtları Açık',
    suggestedTheme: 'forest_fresh',
    defaultBio: 'Çocuk Sanat, Drama, Robotik Kodlama ve Anne-Bebek Oyun Grupları. Keşfederek eğleniyoruz! 🎨🤖🎭',
    suggestedLinks: [
      {
        title: '🎟️ Hafta Sonu Atölye Rezervasyonu',
        subtitle: 'Yaş grubunuza uygun atölyelerde yerinizi ayırtın',
        url: '#lead-form',
        iconType: 'form',
        colorTheme: 'emerald',
        badgeText: 'Sınırlı Kontenjan',
        actionType: 'leadForm',
      },
      {
        title: '🎉 Doğum Günü & Özel Organizasyon',
        subtitle: 'Çocuğunuz için unutulmaz konsept doğum günü partileri',
        url: 'https://wa.me/905000000000',
        iconType: 'whatsapp',
        colorTheme: 'rose',
        badgeText: 'Özel Teklif',
      },
      {
        title: '📸 Güncel Atölye Programı & Görseller',
        subtitle: 'Instagram sayfamızda bu haftanın programını inceleyin',
        url: 'https://instagram.com',
        iconType: 'instagram',
        colorTheme: 'violet',
      },
      {
        title: '📍 Atölye Konumu & Yol Tarifi',
        subtitle: 'Atölyemize kolay ulaşım için konum bilgisi',
        url: 'https://maps.google.com',
        iconType: 'map',
        colorTheme: 'amber',
      }
    ]
  }
];
