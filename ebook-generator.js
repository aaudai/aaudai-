// E-Book Generator JavaScript

// Check if jsPDF is available
let jsPDF = null;

// Try to get jsPDF from window
function initJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) {
        jsPDF = window.jspdf.jsPDF;
        return true;
    } else if (window.jsPDF) {
        jsPDF = window.jsPDF;
        return true;
    }
    return false;
}

// Wait for jsPDF to load
window.addEventListener('load', () => {
    if (!initJsPDF()) {
        console.error('jsPDF library not loaded');
        // Show a message to user
        const infoBox = document.querySelector('.info-box p');
        if (infoBox) {
            infoBox.innerHTML = '⚠️ PDF-Bibliothek wird geladen... Bitte warten Sie einen Moment und versuchen Sie es erneut.';
        }
    }
});

// Store generated content
let generatedContent = null;

// Form submission handler
document.getElementById('ebookGeneratorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        title: document.getElementById('ebookTitle').value,
        level: document.getElementById('ebookLevel').value,
        lessons: parseInt(document.getElementById('ebookPages').value),
        targetAudience: document.getElementById('targetAudience').value,
        topic: document.getElementById('ebookTopic').value,
        specialFeatures: document.getElementById('specialFeatures').value,
        author: document.getElementById('authorName').value,
        year: document.getElementById('publicationYear').value
    };
    
    // Show progress section
    document.getElementById('progressSection').classList.add('active');
    document.getElementById('resultSection').classList.remove('active');
    document.getElementById('generateBtn').disabled = true;
    
    // Generate content
    await generateEbookContent(formData);
});

// Generate e-book content using AI-like logic
async function generateEbookContent(formData) {
    updateProgress(10, 'Strukturiere E-Book-Inhalt...');
    await delay(500);
    
    updateProgress(30, 'Generiere Lektionen...');
    const lessons = generateLessons(formData);
    await delay(800);
    
    updateProgress(60, 'Erstelle Übungen und Beispiele...');
    await delay(600);
    
    updateProgress(80, 'Formatiere PDF-Dokument...');
    const pdfData = await createPDF(formData, lessons);
    await delay(500);
    
    updateProgress(100, 'E-Book fertig!');
    
    // Store the generated content
    generatedContent = pdfData;
    
    // Show result section
    setTimeout(() => {
        document.getElementById('progressSection').classList.remove('active');
        document.getElementById('resultSection').classList.add('active');
        document.getElementById('generateBtn').disabled = false;
    }, 500);
}

// Generate lesson content
function generateLessons(formData) {
    const lessons = [];
    const topicAreas = getTopicAreas(formData.topic, formData.level);
    
    for (let i = 0; i < formData.lessons; i++) {
        const lessonNumber = i + 1;
        const topicArea = topicAreas[i % topicAreas.length];
        
        lessons.push({
            number: lessonNumber,
            title: `Lektion ${lessonNumber}: ${topicArea.title}`,
            titleArabic: topicArea.titleArabic,
            content: generateLessonContent(topicArea, formData.level, formData.targetAudience),
            vocabulary: generateVocabulary(topicArea, 10),
            examples: generateExamples(topicArea, 3),
            exercises: generateExercises(topicArea, 5)
        });
    }
    
    return lessons;
}

// Get topic areas based on main topic and level
function getTopicAreas(mainTopic, level) {
    // Topic areas specifically for Arabic immigrants in Germany
    const topicsByCategory = {
        'Alltag und Integration': [
            { title: 'Erste Schritte in Deutschland', titleArabic: 'الخطوات الأولى في ألمانيا' },
            { title: 'Einkaufen im Supermarkt', titleArabic: 'التسوق في السوبرماركت' },
            { title: 'Nachbarn und Gemeinschaft', titleArabic: 'الجيران والمجتمع' },
            { title: 'Deutsche Kultur verstehen', titleArabic: 'فهم الثقافة الألمانية' },
            { title: 'Feste und Feiertage', titleArabic: 'الأعياد والمناسبات' },
            { title: 'Pünktlichkeit und Termine', titleArabic: 'الدقة في المواعيد' },
            { title: 'Mülltrennung und Recycling', titleArabic: 'فرز النفايات وإعادة التدوير' },
            { title: 'Verhaltensregeln in Deutschland', titleArabic: 'قواعد السلوك في ألمانيا' }
        ],
        'Behörden und Ämter': [
            { title: 'Anmeldung beim Bürgeramt', titleArabic: 'التسجيل في مكتب المواطنين' },
            { title: 'Ausländerbehörde und Aufenthaltstitel', titleArabic: 'دائرة شؤون الأجانب وتصريح الإقامة' },
            { title: 'Arbeitsagentur und Jobcenter', titleArabic: 'وكالة العمل ومركز العمل' },
            { title: 'Finanzamt und Steuern', titleArabic: 'مكتب الضرائب والضرائب' },
            { title: 'Bankkonto eröffnen', titleArabic: 'فتح حساب بنكي' },
            { title: 'Versicherungen verstehen', titleArabic: 'فهم التأمينات' },
            { title: 'Wichtige Dokumente', titleArabic: 'الوثائق المهمة' },
            { title: 'Formulare ausfüllen', titleArabic: 'ملء النماذج' }
        ],
        'Arbeitssuche und Beruf': [
            { title: 'Lebenslauf auf Deutsch', titleArabic: 'السيرة الذاتية بالألمانية' },
            { title: 'Bewerbungsgespräch', titleArabic: 'مقابلة العمل' },
            { title: 'Arbeitsvertrag verstehen', titleArabic: 'فهم عقد العمل' },
            { title: 'Am Arbeitsplatz kommunizieren', titleArabic: 'التواصل في مكان العمل' },
            { title: 'Qualifikationen anerkennen lassen', titleArabic: 'الاعتراف بالمؤهلات' },
            { title: 'Ausbildung und Umschulung', titleArabic: 'التدريب وإعادة التدريب' },
            { title: 'Arbeitsrechte in Deutschland', titleArabic: 'حقوق العمل في ألمانيا' },
            { title: 'Selbstständigkeit und Firmengründung', titleArabic: 'العمل الحر وتأسيس الشركات' }
        ],
        'Medizin und Gesundheit': [
            { title: 'Krankenversicherung', titleArabic: 'التأمين الصحي' },
            { title: 'Arzttermin vereinbaren', titleArabic: 'حجز موعد عند الطبيب' },
            { title: 'Beim Arzt: Symptome beschreiben', titleArabic: 'عند الطبيب: وصف الأعراض' },
            { title: 'In der Apotheke', titleArabic: 'في الصيدلية' },
            { title: 'Notfall und Krankenhaus', titleArabic: 'الطوارئ والمستشفى' },
            { title: 'Medizinische Fachbegriffe', titleArabic: 'المصطلحات الطبية' },
            { title: 'Schwangerschaft und Geburt', titleArabic: 'الحمل والولادة' },
            { title: 'Kinderarzt und Vorsorge', titleArabic: 'طبيب الأطفال والفحوصات الوقائية' }
        ],
        'Wohnung und Vermietung': [
            { title: 'Wohnungssuche in Deutschland', titleArabic: 'البحث عن شقة في ألمانيا' },
            { title: 'Mietvertrag verstehen', titleArabic: 'فهم عقد الإيجار' },
            { title: 'Nebenkosten und Kaution', titleArabic: 'التكاليف الإضافية والتأمين' },
            { title: 'Kontakt mit dem Vermieter', titleArabic: 'التواصل مع المؤجر' },
            { title: 'Wohnungsübergabe', titleArabic: 'تسليم الشقة' },
            { title: 'Renovierung und Reparaturen', titleArabic: 'التجديد والإصلاحات' },
            { title: 'Kündigung und Auszug', titleArabic: 'الإلغاء والانتقال' },
            { title: 'Hausordnung befolgen', titleArabic: 'اتباع قواعد المبنى' }
        ],
        'Einkaufen und Finanzen': [
            { title: 'Im Supermarkt einkaufen', titleArabic: 'التسوق في السوبرماركت' },
            { title: 'Preise vergleichen', titleArabic: 'مقارنة الأسعار' },
            { title: 'Umtausch und Reklamation', titleArabic: 'الاستبدال والشكوى' },
            { title: 'Bankkonto und Überweisungen', titleArabic: 'الحساب البنكي والتحويلات' },
            { title: 'Online-Banking', titleArabic: 'الخدمات البنكية عبر الإنترنت' },
            { title: 'Budgetplanung', titleArabic: 'تخطيط الميزانية' },
            { title: 'Sparen und Investieren', titleArabic: 'الادخار والاستثمار' },
            { title: 'Verträge kündigen', titleArabic: 'إلغاء العقود' }
        ],
        'Bildung und Kinderbetreuung': [
            { title: 'Kindergarten und Kita', titleArabic: 'روضة الأطفال والحضانة' },
            { title: 'Schulsystem in Deutschland', titleArabic: 'نظام التعليم في ألمانيا' },
            { title: 'Elterngespräche', titleArabic: 'لقاءات أولياء الأمور' },
            { title: 'Hausaufgaben und Lernen', titleArabic: 'الواجبات المنزلية والتعلم' },
            { title: 'Integrationskurse', titleArabic: 'دورات الاندماج' },
            { title: 'Sprachkurse und Prüfungen', titleArabic: 'دورات اللغة والامتحانات' },
            { title: 'Weiterbildung und Studium', titleArabic: 'التعليم المستمر والدراسة الجامعية' },
            { title: 'BAföG und Stipendien', titleArabic: 'منح BAföG والمنح الدراسية' }
        ],
        'Öffentliche Verkehrsmittel': [
            { title: 'Bus und Bahn nutzen', titleArabic: 'استخدام الحافلات والقطارات' },
            { title: 'Fahrkarten kaufen', titleArabic: 'شراء التذاكر' },
            { title: 'Fahrpläne lesen', titleArabic: 'قراءة مواعيد الرحلات' },
            { title: 'Am Bahnhof', titleArabic: 'في محطة القطار' },
            { title: 'Verspätungen und Ausfälle', titleArabic: 'التأخيرات والإلغاءات' },
            { title: 'Monatskarten und Abos', titleArabic: 'التذاكر الشهرية والاشتراكات' },
            { title: 'Taxi und Uber', titleArabic: 'التاكسي وأوبر' },
            { title: 'Fahrrad in Deutschland', titleArabic: 'الدراجة الهوائية في ألمانيا' }
        ],
        'Soziale Integration': [
            { title: 'Freunde finden', titleArabic: 'إيجاد الأصدقاء' },
            { title: 'Small Talk führen', titleArabic: 'إجراء محادثات قصيرة' },
            { title: 'Einladungen und Besuche', titleArabic: 'الدعوات والزيارات' },
            { title: 'Vereine und Gruppen', titleArabic: 'النوادي والمجموعات' },
            { title: 'Feste und Veranstaltungen', titleArabic: 'الحفلات والفعاليات' },
            { title: 'Kulturelle Unterschiede', titleArabic: 'الاختلافات الثقافية' },
            { title: 'Höflichkeitsformen', titleArabic: 'صيغ المجاملة' },
            { title: 'Konfliktlösung', titleArabic: 'حل النزاعات' }
        ],
        'Notfälle und Hilfe': [
            { title: 'Notrufnummern', titleArabic: 'أرقام الطوارئ' },
            { title: 'Bei der Polizei', titleArabic: 'في مركز الشرطة' },
            { title: 'Im Notfall kommunizieren', titleArabic: 'التواصل في حالات الطوارئ' },
            { title: 'Beratungsstellen', titleArabic: 'مراكز الاستشارة' },
            { title: 'Rechte und Pflichten', titleArabic: 'الحقوق والواجبات' },
            { title: 'Diskriminierung melden', titleArabic: 'الإبلاغ عن التمييز' },
            { title: 'Sozialleistungen', titleArabic: 'الخدمات الاجتماعية' },
            { title: 'Hilfe für Flüchtlinge', titleArabic: 'المساعدة للاجئين' }
        ]
    };
    
    // Get topics for the selected category
    const categoryTopics = topicsByCategory[mainTopic] || topicsByCategory['Alltag und Integration'];
    
    // Add some general topics that work for all categories
    const generalTopics = [
        { title: 'Grundlegende Kommunikation', titleArabic: 'التواصل الأساسي' },
        { title: 'Höfliche Formulierungen', titleArabic: 'العبارات المهذبة' },
        { title: 'Telefonieren auf Deutsch', titleArabic: 'التحدث عبر الهاتف بالألمانية' },
        { title: 'E-Mails schreiben', titleArabic: 'كتابة رسائل البريد الإلكتروني' },
        { title: 'Um Hilfe bitten', titleArabic: 'طلب المساعدة' },
        { title: 'Sich entschuldigen', titleArabic: 'الاعتذار' },
        { title: 'Zeitangaben und Termine', titleArabic: 'التعبير عن الوقت والمواعيد' },
        { title: 'Wegbeschreibungen', titleArabic: 'وصف الطريق' }
    ];
    
    // Combine and return mixed topics
    return [...categoryTopics, ...generalTopics];
}

// Generate lesson content
function generateLessonContent(topicArea, level, targetAudience) {
    return {
        introduction: `In dieser Lektion lernen Sie wichtige Aspekte von "${topicArea.title}". ` +
                     `Diese Lektion ist speziell für ${targetAudience} auf Niveau ${level} entwickelt.`,
        introductionArabic: `في هذا الدرس، ستتعلم جوانب مهمة من "${topicArea.titleArabic}". ` +
                          `هذا الدرس مصمم خصيصاً للمستوى ${level}.`,
        mainPoints: [
            'Grundlegende Vokabeln und Phrasen',
            'Grammatikregeln und Strukturen',
            'Praktische Anwendungsbeispiele',
            'Kulturelle Hinweise',
            'Tipps für arabische Muttersprachler'
        ]
    };
}

// Generate vocabulary list
function generateVocabulary(topicArea, count) {
    // Vocabulary specifically relevant for Arabic immigrants in Germany
    const vocabularyByTopic = {
        'Anmeldung': [
            { german: 'die Anmeldung', arabic: 'التسجيل', pronunciation: 'dee Anmeldung' },
            { german: 'das Bürgeramt', arabic: 'مكتب المواطنين', pronunciation: 'das Bürgeramt' },
            { german: 'der Personalausweis', arabic: 'بطاقة الهوية', pronunciation: 'der Personalausweis' },
            { german: 'die Meldebestätigung', arabic: 'شهادة التسجيل', pronunciation: 'dee Meldebestätigung' },
            { german: 'die Adresse', arabic: 'العنوان', pronunciation: 'dee Adresse' },
            { german: 'der Wohnsitz', arabic: 'محل الإقامة', pronunciation: 'der Wohnsitz' },
            { german: 'sich anmelden', arabic: 'يسجل نفسه', pronunciation: 'sich anmelden' },
            { german: 'das Formular', arabic: 'النموذج', pronunciation: 'das Formular' },
            { german: 'der Termin', arabic: 'الموعد', pronunciation: 'der Termin' },
            { german: 'die Unterschrift', arabic: 'التوقيع', pronunciation: 'dee Unterschrift' }
        ],
        'Arzt': [
            { german: 'der Arzt / die Ärztin', arabic: 'الطبيب / الطبيبة', pronunciation: 'der Artst' },
            { german: 'die Krankenversicherung', arabic: 'التأمين الصحي', pronunciation: 'dee Krankenversicherung' },
            { german: 'die Versichertenkarte', arabic: 'بطاقة التأمين', pronunciation: 'dee Versichertenkarte' },
            { german: 'der Termin', arabic: 'الموعد', pronunciation: 'der Termin' },
            { german: 'die Schmerzen', arabic: 'الآلام', pronunciation: 'dee Schmerzen' },
            { german: 'das Rezept', arabic: 'الوصفة الطبية', pronunciation: 'das Rezept' },
            { german: 'die Apotheke', arabic: 'الصيدلية', pronunciation: 'dee Apotheke' },
            { german: 'das Medikament', arabic: 'الدواء', pronunciation: 'das Medikament' },
            { german: 'die Krankschreibung', arabic: 'شهادة مرضية', pronunciation: 'dee Krankschreibung' },
            { german: 'der Notfall', arabic: 'الطوارئ', pronunciation: 'der Notfall' }
        ],
        'Arbeit': [
            { german: 'die Arbeit', arabic: 'العمل', pronunciation: 'dee Arbait' },
            { german: 'die Bewerbung', arabic: 'طلب التوظيف', pronunciation: 'dee Bewerbung' },
            { german: 'der Lebenslauf', arabic: 'السيرة الذاتية', pronunciation: 'der Lebenslauf' },
            { german: 'das Vorstellungsgespräch', arabic: 'مقابلة العمل', pronunciation: 'das Vorstellungsgespräch' },
            { german: 'der Arbeitsvertrag', arabic: 'عقد العمل', pronunciation: 'der Arbeitsvertrag' },
            { german: 'das Gehalt', arabic: 'الراتب', pronunciation: 'das Gehalt' },
            { german: 'die Arbeitserlaubnis', arabic: 'تصريح العمل', pronunciation: 'dee Arbeitserlaubnis' },
            { german: 'die Arbeitsagentur', arabic: 'وكالة العمل', pronunciation: 'dee Arbeitsagentur' },
            { german: 'die Qualifikation', arabic: 'المؤهل', pronunciation: 'dee Qualifikation' },
            { german: 'die Ausbildung', arabic: 'التدريب المهني', pronunciation: 'dee Ausbildung' }
        ],
        'Wohnung': [
            { german: 'die Wohnung', arabic: 'الشقة', pronunciation: 'dee Wohnung' },
            { german: 'die Miete', arabic: 'الإيجار', pronunciation: 'dee Miete' },
            { german: 'der Vermieter', arabic: 'المؤجر', pronunciation: 'der Vermieter' },
            { german: 'der Mietvertrag', arabic: 'عقد الإيجار', pronunciation: 'der Mietvertrag' },
            { german: 'die Kaution', arabic: 'التأمين', pronunciation: 'dee Kaution' },
            { german: 'die Nebenkosten', arabic: 'التكاليف الإضافية', pronunciation: 'dee Nebenkosten' },
            { german: 'die Wohnungsbesichtigung', arabic: 'معاينة الشقة', pronunciation: 'dee Wohnungsbesichtigung' },
            { german: 'die Kündigung', arabic: 'الإلغاء', pronunciation: 'dee Kündigung' },
            { german: 'die Renovierung', arabic: 'التجديد', pronunciation: 'dee Renovierung' },
            { german: 'der Hausmeister', arabic: 'حارس المبنى', pronunciation: 'der Hausmeister' }
        ],
        'Einkaufen': [
            { german: 'der Supermarkt', arabic: 'السوبرماركت', pronunciation: 'der Supermarkt' },
            { german: 'die Kasse', arabic: 'الكاشير', pronunciation: 'dee Kasse' },
            { german: 'der Preis', arabic: 'السعر', pronunciation: 'der Preis' },
            { german: 'das Sonderangebot', arabic: 'العرض الخاص', pronunciation: 'das Sonderangebot' },
            { german: 'die Quittung', arabic: 'الإيصال', pronunciation: 'dee Quittung' },
            { german: 'bar bezahlen', arabic: 'الدفع نقداً', pronunciation: 'bar bezahlen' },
            { german: 'mit Karte zahlen', arabic: 'الدفع بالبطاقة', pronunciation: 'mit Karte zahlen' },
            { german: 'der Umtausch', arabic: 'الاستبدال', pronunciation: 'der Umtausch' },
            { german: 'die Öffnungszeiten', arabic: 'أوقات العمل', pronunciation: 'dee Öffnungszeiten' },
            { german: 'das Pfand', arabic: 'التأمين القابل للإرجاع', pronunciation: 'das Pfand' }
        ]
    };
    
    // Try to find relevant vocabulary based on lesson title
    let vocabList = [];
    for (const [key, vocab] of Object.entries(vocabularyByTopic)) {
        if (topicArea.title.includes(key) || topicArea.title.toLowerCase().includes(key.toLowerCase())) {
            vocabList = vocab;
            break;
        }
    }
    
    // If no specific match, use a general vocabulary list
    if (vocabList.length === 0) {
        vocabList = [
            { german: 'Guten Tag', arabic: 'نهارك سعيد', pronunciation: 'Guten Tahk' },
            { german: 'Danke', arabic: 'شكراً', pronunciation: 'Danke' },
            { german: 'Bitte', arabic: 'من فضلك', pronunciation: 'Bitte' },
            { german: 'Entschuldigung', arabic: 'عذراً', pronunciation: 'Entschuldigung' },
            { german: 'Ich verstehe nicht', arabic: 'أنا لا أفهم', pronunciation: 'Ich fershtaaye nicht' },
            { german: 'Können Sie helfen?', arabic: 'هل يمكنك المساعدة؟', pronunciation: 'Können Zee helfen' },
            { german: 'Wie viel kostet das?', arabic: 'كم يكلف هذا؟', pronunciation: 'Vee feel kostet das' },
            { german: 'Wo ist...?', arabic: 'أين...؟', pronunciation: 'Vo ist' },
            { german: 'Ich brauche...', arabic: 'أحتاج...', pronunciation: 'Ich braukhe' },
            { german: 'Ich möchte...', arabic: 'أريد...', pronunciation: 'Ich mökhte' }
        ];
    }
    
    return vocabList.slice(0, count);
}

// Generate examples
function generateExamples(topicArea, count) {
    // Practical examples for immigrants
    const examplesByTopic = {
        'Anmeldung': [
            {
                german: 'Ich möchte mich anmelden. Ich bin neu in Deutschland.',
                arabic: 'أريد أن أسجل نفسي. أنا جديد في ألمانيا.',
                explanation: 'Bei der ersten Anmeldung im Bürgeramt'
            },
            {
                german: 'Welche Dokumente brauche ich für die Anmeldung?',
                arabic: 'ما هي المستندات التي أحتاجها للتسجيل؟',
                explanation: 'Wichtige Frage beim Amt'
            },
            {
                german: 'Können Sie mir bitte helfen? Ich spreche noch nicht gut Deutsch.',
                arabic: 'هل يمكنك مساعدتي من فضلك؟ لا أتحدث الألمانية بشكل جيد بعد.',
                explanation: 'Um Hilfe bitten, wenn Sie etwas nicht verstehen'
            }
        ],
        'Arzt': [
            {
                german: 'Ich habe Kopfschmerzen und Fieber.',
                arabic: 'لدي صداع وحمى.',
                explanation: 'Symptome beim Arzt beschreiben'
            },
            {
                german: 'Ich brauche ein Rezept für die Apotheke.',
                arabic: 'أحتاج إلى وصفة طبية للصيدلية.',
                explanation: 'Nach einem Rezept fragen'
            },
            {
                german: 'Wo ist die nächste Apotheke?',
                arabic: 'أين أقرب صيدلية؟',
                explanation: 'Nach einer Apotheke fragen'
            }
        ],
        'Arbeit': [
            {
                german: 'Ich suche eine Arbeit als Koch.',
                arabic: 'أبحث عن عمل كطاه.',
                explanation: 'Bei der Arbeitsagentur'
            },
            {
                german: 'Ich habe Erfahrung in diesem Bereich.',
                arabic: 'لدي خبرة في هذا المجال.',
                explanation: 'Im Bewerbungsgespräch'
            },
            {
                german: 'Wann kann ich anfangen?',
                arabic: 'متى يمكنني البدء؟',
                explanation: 'Nach dem Vorstellungsgespräch'
            }
        ],
        'Wohnung': [
            {
                german: 'Ich interessiere mich für die Wohnung.',
                arabic: 'أنا مهتم بالشقة.',
                explanation: 'Bei der Wohnungsbesichtigung'
            },
            {
                german: 'Wie hoch ist die Miete?',
                arabic: 'كم يبلغ الإيجار؟',
                explanation: 'Nach den Kosten fragen'
            },
            {
                german: 'Sind die Nebenkosten inklusive?',
                arabic: 'هل التكاليف الإضافية مشمولة؟',
                explanation: 'Wichtige Frage beim Vermieter'
            }
        ],
        'Einkaufen': [
            {
                german: 'Wo finde ich Brot?',
                arabic: 'أين أجد الخبز؟',
                explanation: 'Im Supermarkt nach Produkten fragen'
            },
            {
                german: 'Kann ich mit Karte bezahlen?',
                arabic: 'هل يمكنني الدفع بالبطاقة؟',
                explanation: 'An der Kasse'
            },
            {
                german: 'Haben Sie das auch in größer?',
                arabic: 'هل لديك هذا بمقاس أكبر؟',
                explanation: 'Beim Kleidungskauf'
            }
        ]
    };
    
    // Try to find relevant examples
    let examples = [];
    for (const [key, exampleList] of Object.entries(examplesByTopic)) {
        if (topicArea.title.includes(key) || topicArea.title.toLowerCase().includes(key.toLowerCase())) {
            examples = exampleList;
            break;
        }
    }
    
    // Default examples if no match
    if (examples.length === 0) {
        examples = [
            {
                german: 'Guten Tag! Können Sie mir helfen?',
                arabic: 'نهارك سعيد! هل يمكنك مساعدتي؟',
                explanation: 'Höflich um Hilfe bitten'
            },
            {
                german: 'Ich verstehe das nicht. Können Sie das wiederholen?',
                arabic: 'أنا لا أفهم ذلك. هل يمكنك تكرار ذلك؟',
                explanation: 'Wenn Sie etwas nicht verstanden haben'
            },
            {
                german: 'Sprechen Sie vielleicht Englisch oder Arabisch?',
                arabic: 'هل تتحدث الإنجليزية أو العربية؟',
                explanation: 'Nach einer gemeinsamen Sprache fragen'
            }
        ];
    }
    
    return examples.slice(0, count);
}

// Generate exercises
function generateExercises(topicArea, count) {
    const exercises = [];
    for (let i = 0; i < count; i++) {
        exercises.push({
            question: `Übung ${i + 1}: Ergänzen Sie den Satz mit dem richtigen Wort.`,
            questionArabic: `تمرين ${i + 1}: أكمل الجملة بالكلمة الصحيحة.`,
            answer: 'Lösung im Anhang'
        });
    }
    return exercises;
}

// Create PDF document
async function createPDF(formData, lessons) {
    // Initialize jsPDF if not already done
    if (!jsPDF && !initJsPDF()) {
        throw new Error('jsPDF library not available');
    }
    
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    let currentPage = 1;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    
    // Helper function to add new page
    const addNewPage = () => {
        doc.addPage();
        currentPage++;
        return margin; // Return new Y position
    };
    
    // Helper function to check if we need a new page
    const checkPageBreak = (yPos, requiredSpace = 20) => {
        if (yPos + requiredSpace > pageHeight - margin) {
            return addNewPage();
        }
        return yPos;
    };
    
    // Cover Page
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(formData.title, contentWidth - 20);
    let yPos = 80;
    titleLines.forEach(line => {
        doc.text(line, pageWidth / 2, yPos, { align: 'center' });
        yPos += 12;
    });
    
    doc.setFontSize(20);
    doc.text(`Niveau ${formData.level}`, pageWidth / 2, yPos + 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(formData.targetAudience, pageWidth / 2, yPos + 35, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Von ${formData.author}`, pageWidth / 2, pageHeight - 40, { align: 'center' });
    doc.text(`© ${formData.year}`, pageWidth / 2, pageHeight - 30, { align: 'center' });
    
    // Table of Contents
    yPos = addNewPage();
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Inhaltsverzeichnis', margin, yPos);
    doc.text('جدول المحتويات', pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 15;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    lessons.forEach((lesson, index) => {
        yPos = checkPageBreak(yPos, 10);
        doc.text(`Lektion ${lesson.number}: ${lesson.title}`, margin + 5, yPos);
        doc.text(`${currentPage + index + 1}`, pageWidth - margin - 5, yPos, { align: 'right' });
        yPos += 7;
    });
    
    // Introduction Page
    yPos = addNewPage();
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Einführung', margin, yPos);
    doc.text('مقدمة', pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 15;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const introText = `Willkommen zu "${formData.title}"! Dieses E-Book wurde speziell für ${formData.targetAudience} entwickelt und behandelt ${formData.topic} auf Niveau ${formData.level}. ` +
        `Mit ${formData.lessons} umfassenden Lektionen werden Sie systematisch durch alle wichtigen Themen geführt. ` +
        `${formData.specialFeatures ? 'Besondere Merkmale: ' + formData.specialFeatures : ''}`;
    
    const introLines = doc.splitTextToSize(introText, contentWidth);
    introLines.forEach(line => {
        yPos = checkPageBreak(yPos, 8);
        doc.text(line, margin, yPos);
        yPos += 6;
    });
    
    yPos += 10;
    yPos = checkPageBreak(yPos, 20);
    const arabicIntro = 'مرحباً بك في هذا الكتاب التعليمي! تم تصميم هذا الكتاب خصيصاً لمساعدتك في تعلم اللغة الألمانية.';
    doc.text(arabicIntro, pageWidth - margin, yPos, { align: 'right' });
    
    // Lessons
    lessons.forEach((lesson, index) => {
        yPos = addNewPage();
        
        // Lesson Header
        doc.setFillColor(37, 99, 235);
        doc.rect(margin, yPos - 5, contentWidth, 15, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(lesson.title, margin + 3, yPos + 5);
        doc.text(lesson.titleArabic, pageWidth - margin - 3, yPos + 5, { align: 'right' });
        
        yPos += 25;
        
        // Introduction
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        const contentLines = doc.splitTextToSize(lesson.content.introduction, contentWidth);
        contentLines.forEach(line => {
            yPos = checkPageBreak(yPos, 8);
            doc.text(line, margin, yPos);
            yPos += 6;
        });
        
        yPos += 5;
        yPos = checkPageBreak(yPos, 8);
        doc.text(lesson.content.introductionArabic, pageWidth - margin, yPos, { align: 'right' });
        
        yPos += 15;
        
        // Vocabulary Section
        yPos = checkPageBreak(yPos, 25);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Vokabeln | المفردات', margin, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        lesson.vocabulary.forEach((vocab, idx) => {
            yPos = checkPageBreak(yPos, 10);
            doc.text(`${idx + 1}. ${vocab.german}`, margin + 5, yPos);
            doc.text(vocab.arabic, pageWidth / 2 + 10, yPos);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(100, 100, 100);
            doc.text(`[${vocab.pronunciation}]`, pageWidth - margin - 5, yPos, { align: 'right' });
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            yPos += 7;
        });
        
        yPos += 10;
        
        // Examples Section
        yPos = checkPageBreak(yPos, 25);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Beispiele | أمثلة', margin, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        lesson.examples.forEach((example, idx) => {
            yPos = checkPageBreak(yPos, 15);
            doc.setFont('helvetica', 'bold');
            doc.text(`${idx + 1}.`, margin + 5, yPos);
            doc.setFont('helvetica', 'normal');
            const exampleLines = doc.splitTextToSize(example.german, contentWidth - 15);
            exampleLines.forEach(line => {
                doc.text(line, margin + 10, yPos);
                yPos += 5;
            });
            doc.text(example.arabic, pageWidth - margin, yPos, { align: 'right' });
            yPos += 8;
        });
        
        yPos += 10;
        
        // Exercises Section
        yPos = checkPageBreak(yPos, 25);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Übungen | تمارين', margin, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        lesson.exercises.forEach((exercise, idx) => {
            yPos = checkPageBreak(yPos, 12);
            doc.text(`${idx + 1}. ${exercise.question}`, margin + 5, yPos);
            yPos += 6;
            doc.text(exercise.questionArabic, pageWidth - margin, yPos, { align: 'right' });
            yPos += 8;
        });
    });
    
    // Final Page
    yPos = addNewPage();
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Herzlichen Glückwunsch!', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
    doc.text('مبروك!', pageWidth / 2, pageHeight / 2, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Sie haben dieses E-Book abgeschlossen.', pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
    doc.text('Viel Erfolg beim weiteren Lernen!', pageWidth / 2, pageHeight / 2 + 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`© ${formData.year} ${formData.author}. Alle Rechte vorbehalten.`, pageWidth / 2, pageHeight - 30, { align: 'center' });
    
    return doc;
}

// Download PDF
document.getElementById('downloadBtn').addEventListener('click', () => {
    if (generatedContent) {
        const fileName = document.getElementById('ebookTitle').value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'ebook';
        
        generatedContent.save(`${fileName}.pdf`);
    }
});

// Helper functions
function updateProgress(percentage, text) {
    document.getElementById('progressBarFill').style.width = `${percentage}%`;
    document.getElementById('progressText').textContent = text;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
