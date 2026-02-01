export const translations = {
  en: {
    common: {
      brand: 'TA Personality',
      backHome: 'Back to Home',
      themeLight: 'Light',
      themeDark: 'Dark',
      languageEnglish: 'English',
      languageIndonesian: 'Indonesian',
      copied: 'Copied!',
      share: 'Share',
      disclaimerTitle: 'Important Disclaimers:',
      disclaimers: [
        'This is an experimental academic demo for research purposes only.',
        'Predictions are probabilistic and may be inaccurate.',
        'Not intended for medical, clinical, or employment decisions.',
        'Your audio is used only to compute predictions. Avoid uploading sensitive data.'
      ]
    },
    landing: {
      heroBadge: 'Experimental Research Demo',
      heroTitleLine1: 'Discover Your Personality',
      heroTitleAccent: 'From Your Voice',
      heroSubtitle: 'Upload or record 15 seconds of audio. Our AI models analyze vocal patterns to predict your Big Five (OCEAN) personality traits.',
      ctaPrimary: 'Try Demo Now',
      ctaSecondary: 'Learn More',
      trustBadges: ['15 seconds only', 'No data stored', 'Instant results'],
      howTitle: 'How It Works',
      howSubtitle: 'Three simple steps to your personality profile',
      howSteps: [
        {
          title: 'Record or Upload',
          description: 'Provide exactly 15 seconds of your voice. Read a passage or speak naturally.'
        },
        {
          title: 'Choose Model',
          description: 'Select between fine-tuned WavLM or baseline ridge models with various embeddings.'
        },
        {
          title: 'Get Results',
          description: 'View your Big Five personality prediction with detailed explanations.'
        }
      ],
      modelsTitle: 'Models Available',
      modelsSubtitle: 'Choose your preferred prediction model',
      models: {
        wavlmTitle: 'Fine-tuned WavLM',
        wavlmTagline: 'Recommended',
        wavlmBody: 'A WavLM model specifically fine-tuned for personality trait prediction. Directly maps audio features to Big Five traits.',
        baselineTitle: 'Baseline Ridge Models',
        baselineTagline: 'Multiple options',
        baselineBody: 'Traditional approach using audio embeddings plus ridge regression. Choose from different embedding types:',
        baselineList: [
          'eGeMAPS (acoustic features)',
          'wav2vec2 (self-supervised)',
          'HuBERT (speech representation)',
          'WavLM (general audio)'
        ]
      },
      bigFiveTitle: 'The Big Five (OCEAN)',
      bigFiveSubtitle: 'Understanding the five fundamental personality dimensions',
      bigFiveTraits: [
        {
          key: 'openness',
          name: 'Openness',
          short: 'O',
          description: 'Curiosity, imagination, preference for novelty and variety.'
        },
        {
          key: 'conscientiousness',
          name: 'Conscientiousness',
          short: 'C',
          description: 'Organization, discipline, goal-directed behavior.'
        },
        {
          key: 'extraversion',
          name: 'Extraversion',
          short: 'E',
          description: 'Social energy, assertiveness, talkativeness.'
        },
        {
          key: 'agreeableness',
          name: 'Agreeableness',
          short: 'A',
          description: 'Empathy, cooperation, kindness toward others.'
        },
        {
          key: 'neuroticism',
          name: 'Neuroticism',
          short: 'N',
          description: 'Emotional sensitivity, tendency toward stress/worry.'
        }
      ],
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Common questions about the demo',
      faqItems: [
        {
          question: 'How accurate are the predictions?',
          answer: 'This is an experimental academic demo. Predictions are probabilistic and based on research models. They should not be used for clinical or employment decisions.'
        },
        {
          question: 'Why exactly 15 seconds?',
          answer: 'The models were trained on 15-second audio clips. Using this exact duration ensures consistent and reliable predictions.'
        },
        {
          question: 'What happens to my audio?',
          answer: 'Your audio is processed only for prediction. We do not store your recordings. Everything happens in real-time.'
        },
        {
          question: "What's the difference between models?",
          answer: 'Fine-tuned WavLM was specifically trained for personality prediction. Baseline models use pre-trained audio embeddings with ridge regression.'
        },
        {
          question: 'Can I use this for hiring or clinical diagnosis?',
          answer: 'No. This demo is for educational and research purposes only. It should not be used for any consequential decisions.'
        }
      ],
      ctaTitle: 'Ready to Try?',
      ctaSubtitle: 'Record or upload 15 seconds of audio and discover your personality profile.',
      ctaButton: 'Start Demo',
      footerNote: 'TA Personality Demo - Research Project - Not for commercial use'
    },
    demo: {
      title: 'Voice Personality Analysis',
      subtitle: 'Record or upload 15 seconds of audio to analyze your Big Five traits.',
      privacy: 'Your audio is used only to compute predictions. Avoid uploading sensitive data.',
      audioCardTitle: 'Audio Input',
      audioCardDesc: 'Record or upload exactly 15 seconds of your voice.',
      recordButton: 'Record Audio',
      dragDropTitle: 'Drag & drop audio',
      dragDropSubtitle: 'or click to pick a file',
      recordingLabel: 'Recording...',
      stopRecording: 'Stop Recording',
      durationRequirement: 'Exactly 15 seconds required',
      audioReady: 'Audio Ready',
      play: 'Play Audio',
      pause: 'Pause',
      modelCardTitle: 'Model Selection',
      modelTypeLabel: 'Model Type',
      modelOptionWavlm: 'Fine-tuned WavLM (Recommended)',
      modelOptionBaseline: 'Baseline Ridge Model',
      baselineLabel: 'Baseline Embedding',
      baselinePlaceholder: 'Select baseline',
      baselineLoading: 'Loading...',
      baselineError: 'Could not load baseline models. Using defaults.',
      predict: 'Predict Personality',
      statusUploading: 'Uploading audio...',
      statusInferring: 'Running inference...',
      statusIdle: 'Predict Personality',
      statusInferenceNote: 'Running inference... This may take a moment.',
      statusUploadNote: 'Uploading audio...',
      resultsTitle: 'Your Results',
      share: 'Share',
      copied: 'Copied!',
      traitOverallHeading: 'What this means overall',
      technicalDetails: 'Technical Details',
      model: 'Model',
      baselineKey: 'Baseline Key',
      latency: 'Latency',
      rawResponse: 'Raw Response',
      emptyStateTitle: 'No Results Yet',
      emptyStateSubtitle: 'Record or upload 15 seconds of audio, then click "Predict Personality" to see your results.',
      aboutTitle: 'About Big Five (OCEAN)',
      aboutItems: [
        'Openness - Curiosity, imagination, preference for novelty.',
        'Conscientiousness - Organization, discipline, goal-directed behavior.',
        'Extraversion - Social energy, assertiveness, talkativeness.',
        'Agreeableness - Empathy, cooperation, kindness.',
        'Neuroticism - Emotional sensitivity, tendency toward stress.'
      ],
      errors: {
        microphone: 'Could not access microphone. Please grant permission.',
        fileType: 'Please upload an audio file.',
        missingAudio: 'Please record or upload audio first.',
        processing: 'Failed to process audio. Please try again.',
        existingAudio: 'Clear the existing audio before uploading a new file.',
        duration: (seconds) => `Audio is ${seconds}s. Please record exactly 15 seconds.`,
        unexpected: 'Unexpected response format',
        prediction: 'Prediction failed. Please try again.'
      }
    }
  },
  id: {
    common: {
      brand: 'TA Personality',
      backHome: 'Kembali ke Beranda',
      themeLight: 'Terang',
      themeDark: 'Gelap',
      languageEnglish: 'Inggris',
      languageIndonesian: 'Indonesia',
      copied: 'Tersalin!',
      share: 'Bagikan',
      disclaimerTitle: 'Disclaimer Penting:',
      disclaimers: [
        'Ini adalah demo riset eksperimental untuk keperluan akademik.',
        'Prediksi bersifat probabilistik dan bisa tidak akurat.',
        'Tidak untuk keputusan medis, klinis, maupun rekrutmen.',
        'Audio Anda hanya dipakai untuk komputasi prediksi. Hindari mengunggah data sensitif.'
      ]
    },
    landing: {
      heroBadge: 'Demo Riset Eksperimental',
      heroTitleLine1: 'Temukan Kepribadian Anda',
      heroTitleAccent: 'Lewat Suara Anda',
      heroSubtitle: 'Unggah atau rekam 15 detik audio. Model AI kami menganalisis pola vokal untuk memprediksi kepribadian Big Five (OCEAN) Anda.',
      ctaPrimary: 'Coba Demo Sekarang',
      ctaSecondary: 'Pelajari Lebih Lanjut',
      trustBadges: ['Hanya 15 detik', 'Tanpa penyimpanan data', 'Hasil instan'],
      howTitle: 'Cara Kerjanya',
      howSubtitle: 'Tiga langkah sederhana menuju profil kepribadian Anda',
      howSteps: [
        {
          title: 'Rekam atau Unggah',
          description: 'Sediakan tepat 15 detik suara Anda. Bacakan teks atau bicara alami.'
        },
        {
          title: 'Pilih Model',
          description: 'Pilih antara WavLM yang di-finetune atau model ridge baseline dengan berbagai embedding.'
        },
        {
          title: 'Dapatkan Hasil',
          description: 'Lihat prediksi kepribadian Big Five lengkap dengan penjelasan detail.'
        }
      ],
      modelsTitle: 'Model yang Tersedia',
      modelsSubtitle: 'Pilih model prediksi yang Anda sukai',
      models: {
        wavlmTitle: 'WavLM Fine-tuned',
        wavlmTagline: 'Rekomendasi',
        wavlmBody: 'Model WavLM yang di-finetune khusus untuk prediksi kepribadian. Langsung memetakan fitur audio ke trait Big Five.',
        baselineTitle: 'Model Ridge Baseline',
        baselineTagline: 'Beberapa pilihan',
        baselineBody: 'Pendekatan tradisional memakai embedding audio plus ridge regression. Pilih jenis embedding:',
        baselineList: [
          'eGeMAPS (fitur akustik)',
          'wav2vec2 (self-supervised)',
          'HuBERT (representasi ucapan)',
          'WavLM (audio umum)'
        ]
      },
      bigFiveTitle: 'Big Five (OCEAN)',
      bigFiveSubtitle: 'Memahami lima dimensi kepribadian utama',
      bigFiveTraits: [
        {
          key: 'openness',
          name: 'Openness',
          short: 'O',
          description: 'Rasa ingin tahu, imajinasi, suka hal baru dan variasi.'
        },
        {
          key: 'conscientiousness',
          name: 'Conscientiousness',
          short: 'C',
          description: 'Organisasi, disiplin, perilaku terarah tujuan.'
        },
        {
          key: 'extraversion',
          name: 'Extraversion',
          short: 'E',
          description: 'Energi sosial, asertif, suka berbicara.'
        },
        {
          key: 'agreeableness',
          name: 'Agreeableness',
          short: 'A',
          description: 'Empati, kerja sama, kebaikan terhadap orang lain.'
        },
        {
          key: 'neuroticism',
          name: 'Neuroticism',
          short: 'N',
          description: 'Sensitivitas emosi, kecenderungan cemas atau stres.'
        }
      ],
      faqTitle: 'Pertanyaan yang Sering Diajukan',
      faqSubtitle: 'Pertanyaan umum tentang demo ini',
      faqItems: [
        {
          question: 'Seberapa akurat prediksinya?',
          answer: 'Ini adalah demo riset akademik. Prediksi bersifat probabilistik dan berbasis model penelitian. Jangan dipakai untuk keputusan klinis atau rekrutmen.'
        },
        {
          question: 'Kenapa harus 15 detik?',
          answer: 'Model dilatih dengan klip audio 15 detik. Durasi ini menjaga konsistensi dan reliabilitas prediksi.'
        },
        {
          question: 'Apa yang terjadi pada audio saya?',
          answer: 'Audio hanya diproses untuk prediksi. Kami tidak menyimpan rekaman. Semua terjadi secara real-time.'
        },
        {
          question: 'Apa beda tiap model?',
          answer: 'WavLM fine-tuned dilatih khusus untuk prediksi kepribadian. Model baseline memakai embedding audio pra-latih dengan ridge regression.'
        },
        {
          question: 'Boleh dipakai untuk perekrutan atau diagnosis?',
          answer: 'Tidak. Demo ini hanya untuk edukasi dan riset. Jangan dipakai untuk keputusan yang berdampak.'
        }
      ],
      ctaTitle: 'Siap Mencoba?',
      ctaSubtitle: 'Rekam atau unggah 15 detik audio lalu temukan profil kepribadian Anda.',
      ctaButton: 'Mulai Demo',
      footerNote: 'TA Personality Demo - Proyek Riset - Bukan untuk penggunaan komersial'
    },
    demo: {
      title: 'Analisis Kepribadian Suara',
      subtitle: 'Rekam atau unggah 15 detik audio untuk menganalisis trait Big Five Anda.',
      privacy: 'Audio Anda hanya digunakan untuk komputasi prediksi. Hindari mengunggah data sensitif.',
      audioCardTitle: 'Input Audio',
      audioCardDesc: 'Rekam atau unggah tepat 15 detik suara Anda.',
      recordButton: 'Rekam Audio',
      dragDropTitle: 'Seret & lepas audio',
      dragDropSubtitle: 'atau klik untuk pilih berkas',
      recordingLabel: 'Merekam...',
      stopRecording: 'Hentikan Rekaman',
      durationRequirement: 'Harus tepat 15 detik',
      audioReady: 'Audio siap',
      play: 'Putar Audio',
      pause: 'Jeda',
      modelCardTitle: 'Pemilihan Model',
      modelTypeLabel: 'Jenis Model',
      modelOptionWavlm: 'WavLM Fine-tuned (Rekomendasi)',
      modelOptionBaseline: 'Model Ridge Baseline',
      baselineLabel: 'Embedding Baseline',
      baselinePlaceholder: 'Pilih baseline',
      baselineLoading: 'Memuat...',
      baselineError: 'Gagal memuat baseline. Menggunakan default.',
      predict: 'Prediksi Kepribadian',
      statusUploading: 'Mengunggah audio...',
      statusInferring: 'Menjalankan inferensi...',
      statusIdle: 'Prediksi Kepribadian',
      statusInferenceNote: 'Menjalankan inferensi... Ini mungkin memakan waktu.',
      statusUploadNote: 'Mengunggah audio...',
      resultsTitle: 'Hasil Anda',
      share: 'Bagikan',
      copied: 'Tersalin!',
      traitOverallHeading: 'Maknanya secara keseluruhan',
      technicalDetails: 'Detail Teknis',
      model: 'Model',
      baselineKey: 'Kunci Baseline',
      latency: 'Latensi',
      rawResponse: 'Respons Mentah',
      emptyStateTitle: 'Belum Ada Hasil',
      emptyStateSubtitle: 'Rekam atau unggah 15 detik audio, lalu klik "Prediksi Kepribadian" untuk melihat hasil.',
      aboutTitle: 'Tentang Big Five (OCEAN)',
      aboutItems: [
        'Openness - Rasa ingin tahu, imajinasi, suka hal baru.',
        'Conscientiousness - Organisasi, disiplin, perilaku terarah tujuan.',
        'Extraversion - Energi sosial, asertif, banyak bicara.',
        'Agreeableness - Empati, kerja sama, kebaikan.',
        'Neuroticism - Sensitivitas emosi, cenderung stres.'
      ],
      errors: {
        microphone: 'Tidak dapat mengakses mikrofon. Berikan izin.',
        fileType: 'Silakan unggah berkas audio.',
        missingAudio: 'Silakan rekam atau unggah audio terlebih dahulu.',
        processing: 'Gagal memproses audio. Coba lagi.',
        existingAudio: 'Hapus audio yang ada sebelum mengunggah berkas baru.',
        duration: (seconds) => `Audio berdurasi ${seconds}s. Rekam tepat 15 detik.`,
        unexpected: 'Format respons tidak terduga',
        prediction: 'Prediksi gagal. Coba lagi.'
      }
    }
  }
}

export const traitText = {
  en: {
    openness: {
      name: 'Openness',
      short: 'O',
      descriptions: {
        low: 'You tend to prefer routine and familiar experiences. Practical and grounded.',
        medium: 'You balance curiosity with practicality. Open to new ideas when relevant.',
        high: 'You embrace novelty and creativity. Imaginative and intellectually curious.'
      },
      summaryLabel: 'creative and open-minded'
    },
    conscientiousness: {
      name: 'Conscientiousness',
      short: 'C',
      descriptions: {
        low: 'You prefer flexibility over strict planning. Spontaneous and adaptable.',
        medium: 'You balance organization with flexibility. Reliable when it matters.',
        high: 'You are highly organized and disciplined. Goal-oriented and dependable.'
      },
      summaryLabel: 'organized and disciplined'
    },
    extraversion: {
      name: 'Extraversion',
      short: 'E',
      descriptions: {
        low: 'You recharge through solitude. Thoughtful and introspective.',
        medium: 'You enjoy social time but also value quiet moments. Balanced energy.',
        high: 'You thrive in social settings. Energetic and outgoing.'
      },
      summaryLabel: 'socially energetic'
    },
    agreeableness: {
      name: 'Agreeableness',
      short: 'A',
      descriptions: {
        low: 'You prioritize directness over diplomacy. Independent minded.',
        medium: 'You balance cooperation with self-advocacy. Diplomatic when needed.',
        high: 'You value harmony and cooperation. Empathetic and considerate.'
      },
      summaryLabel: 'empathetic and cooperative'
    },
    neuroticism: {
      name: 'Neuroticism',
      short: 'N',
      descriptions: {
        low: 'You stay calm under pressure. Emotionally stable and resilient.',
        medium: 'You experience normal emotional fluctuations. Generally balanced.',
        high: 'You are emotionally sensitive. May experience stress more intensely.'
      },
      summaryLabel: 'emotionally sensitive'
    }
  },
  id: {
    openness: {
      name: 'Openness (Keterbukaan)',
      short: 'O',
      descriptions: {
        low: 'Anda cenderung menyukai rutinitas dan hal yang familiar. Praktis dan membumi.',
        medium: 'Anda menyeimbangkan rasa ingin tahu dengan kepraktisan. Terbuka pada ide baru jika relevan.',
        high: 'Anda menyukai hal baru dan kreativitas. Imajinatif dan ingin tahu secara intelektual.'
      },
      summaryLabel: 'kreatif dan berpikiran terbuka'
    },
    conscientiousness: {
      name: 'Conscientiousness (Kehati-hatian)',
      short: 'C',
      descriptions: {
        low: 'Anda lebih suka fleksibilitas dibanding perencanaan ketat. Spontan dan mudah beradaptasi.',
        medium: 'Anda menyeimbangkan kerapian dengan fleksibilitas. Dapat diandalkan saat dibutuhkan.',
        high: 'Anda sangat terorganisir dan disiplin. Berorientasi tujuan dan dapat dipercaya.'
      },
      summaryLabel: 'teratur dan disiplin'
    },
    extraversion: {
      name: 'Extraversion (Ekstroversi)',
      short: 'E',
      descriptions: {
        low: 'Anda mengisi ulang energi lewat kesendirian. Reflektif dan introspektif.',
        medium: 'Anda menikmati waktu sosial namun juga menghargai momen tenang. Energi seimbang.',
        high: 'Anda bersinar di situasi sosial. Energik dan supel.'
      },
      summaryLabel: 'energik secara sosial'
    },
    agreeableness: {
      name: 'Agreeableness (Keramahan)',
      short: 'A',
      descriptions: {
        low: 'Anda memprioritaskan keterusterangan dibanding diplomasi. Berpikir mandiri.',
        medium: 'Anda menyeimbangkan kerja sama dengan pembelaan diri. Diplomatis bila perlu.',
        high: 'Anda menghargai harmoni dan kerja sama. Empatik dan perhatian.'
      },
      summaryLabel: 'empatik dan kooperatif'
    },
    neuroticism: {
      name: 'Neuroticism (Neurotisisme)',
      short: 'N',
      descriptions: {
        low: 'Anda tetap tenang dalam tekanan. Stabil dan tangguh secara emosi.',
        medium: 'Anda mengalami fluktuasi emosi yang wajar. Umumnya seimbang.',
        high: 'Anda sensitif secara emosional. Mungkin merasakan stres lebih intens.'
      },
      summaryLabel: 'sensitif secara emosional'
    }
  }
}

export const summaryText = {
  en: {
    balanced: 'Your voice suggests a balanced personality profile with no extreme tendencies in any dimension.',
    intro: 'Based on your voice, you appear to be ',
    outro: '. Remember, this is just an experimental prediction.'
  },
  id: {
    balanced: 'Suara Anda menunjukkan profil kepribadian yang seimbang tanpa kecenderungan ekstrem di tiap dimensi.',
    intro: 'Berdasarkan suara Anda, terlihat bahwa Anda ',
    outro: '. Ingat, ini hanya prediksi eksperimental.'
  }
}

export function getTranslations(locale = 'en') {
  return translations[locale] || translations.en
}
