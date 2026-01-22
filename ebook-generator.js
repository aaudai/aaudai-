// E-Book Generator JavaScript

// Store generated content
let generatedContent = null;
let generatedHTMLContent = null;

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
    const htmlContent = await createPrintableHTML(formData, lessons);
    await delay(500);
    
    updateProgress(100, 'E-Book fertig!');
    
    // Store the generated content
    generatedHTMLContent = htmlContent;
    
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

// Create printable HTML document (PDF-ready)
async function createPrintableHTML(formData, lessons) {
    let html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(formData.title)}</title>
    <style>
        @page { 
            size: A4; 
            margin: 20mm;
        }
        @media print {
            body { margin: 0; padding: 0; }
            .page-break { page-break-after: always; }
            .no-print { display: none; }
        }
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .page {
            padding: 20mm;
            min-height: 257mm;
            background: white;
            position: relative;
        }
        .cover-page {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            text-align: center;
            padding: 80px 40px;
            min-height: 297mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .cover-page h1 {
            font-size: 36pt;
            margin: 20px 0;
            line-height: 1.2;
        }
        .cover-page h2 {
            font-size: 24pt;
            font-weight: normal;
            margin: 10px 0;
        }
        .cover-page .subtitle {
            font-size: 18pt;
            margin: 30px 0;
            opacity: 0.9;
        }
        .cover-page .author {
            position: absolute;
            bottom: 40px;
            font-size: 14pt;
        }
        h1 {
            color: #2563eb;
            font-size: 24pt;
            margin: 30px 0 20px 0;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 10px;
        }
        h2 {
            color: #2563eb;
            font-size: 20pt;
            margin: 25px 0 15px 0;
        }
        h3 {
            color: #1d4ed8;
            font-size: 16pt;
            margin: 20px 0 10px 0;
        }
        .arabic {
            direction: rtl;
            text-align: right;
            font-size: 14pt;
            color: #059669;
            margin: 10px 0;
        }
        .lesson-header {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 20px;
            margin: 30px -20mm 20px -20mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .lesson-number {
            font-size: 14pt;
            opacity: 0.9;
        }
        .vocabulary-section {
            margin: 25px 0;
        }
        .vocab-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        .vocab-table thead {
            background: #eff6ff;
            color: #1e40af;
        }
        .vocab-table th, .vocab-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .vocab-table td:nth-child(2) {
            direction: rtl;
            text-align: right;
        }
        .vocab-table td:nth-child(3) {
            color: #6b7280;
            font-style: italic;
        }
        .example-box {
            background: #f3f4f6;
            border-left: 4px solid #10b981;
            padding: 15px 20px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .example-german {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
        }
        .example-arabic {
            color: #059669;
            direction: rtl;
            text-align: right;
            margin-bottom: 5px;
        }
        .example-explanation {
            color: #6b7280;
            font-size: 10pt;
            font-style: italic;
        }
        .exercise-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px 20px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .toc {
            margin: 30px 0;
        }
        .toc-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dotted #d1d5db;
        }
        .intro-section {
            background: #eff6ff;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border: 1px solid #dbeafe;
        }
        .page-number {
            position: absolute;
            bottom: 10mm;
            right: 20mm;
            color: #9ca3af;
            font-size: 10pt;
        }
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        .print-button:hover {
            background: #059669;
        }
        @media print {
            .print-button { display: none; }
            .container { box-shadow: none; }
            body { background: white; padding: 0; }
        }
    </style>
</head>
<body>
    <button class="print-button no-print" onclick="window.print()">🖨️ Als PDF speichern</button>
    
    <div class="container">
        <!-- Cover Page -->
        <div class="cover-page page-break">
            <h1>${escapeHtml(formData.title)}</h1>
            <h2>Niveau ${escapeHtml(formData.level)}</h2>
            <p class="subtitle">${escapeHtml(formData.targetAudience)}</p>
            <p class="subtitle">${escapeHtml(formData.topic)}</p>
            <div class="author">
                <p>Von ${escapeHtml(formData.author)}</p>
                <p>© ${escapeHtml(formData.year)}</p>
            </div>
        </div>

        <!-- Table of Contents -->
        <div class="page page-break">
            <h1>Inhaltsverzeichnis</h1>
            <p class="arabic">جدول المحتويات</p>
            <div class="toc">
                <div class="toc-item">
                    <span>Einführung</span>
                    <span>3</span>
                </div>
`;

    lessons.forEach((lesson, index) => {
        html += `                <div class="toc-item">
                    <span>Lektion ${lesson.number}: ${escapeHtml(lesson.title)}</span>
                    <span>${4 + index}</span>
                </div>
`;
    });

    html += `            </div>
        </div>

        <!-- Introduction -->
        <div class="page page-break">
            <h1>Einführung</h1>
            <p class="arabic">مقدمة</p>
            
            <div class="intro-section">
                <h3>Willkommen zu "${escapeHtml(formData.title)}"</h3>
                <p>
                    Dieses E-Book wurde speziell für <strong>${escapeHtml(formData.targetAudience)}</strong> entwickelt 
                    und behandelt <strong>${escapeHtml(formData.topic)}</strong> auf Niveau <strong>${escapeHtml(formData.level)}</strong>.
                </p>
                <p>
                    Mit ${formData.lessons} umfassenden Lektionen werden Sie systematisch durch alle wichtigen Themen geführt.
                    Jede Lektion enthält:
                </p>
                <ul>
                    <li>Praktisches Vokabular mit arabischen Übersetzungen</li>
                    <li>Realistische Beispiele aus dem deutschen Alltag</li>
                    <li>Übungen zur Festigung des Gelernten</li>
                    <li>Kulturelle Hinweise und Tipps</li>
                </ul>
                ${formData.specialFeatures ? `<p><strong>Besondere Merkmale:</strong> ${escapeHtml(formData.specialFeatures)}</p>` : ''}
                
                <p class="arabic">
                    مرحباً بك في هذا الكتاب التعليمي! تم تصميم هذا الكتاب خصيصاً لمساعدتك في تعلم اللغة الألمانية
                    والاندماج في الحياة في ألمانيا. كل درس يحتوي على مفردات عملية وأمثلة واقعية وتمارين.
                </p>
            </div>
        </div>
`;

    // Generate lessons
    lessons.forEach((lesson, lessonIndex) => {
        html += `
        <!-- Lesson ${lesson.number} -->
        <div class="page page-break">
            <div class="lesson-header">
                <div>
                    <div class="lesson-number">Lektion ${lesson.number}</div>
                    <h2 style="margin: 5px 0; color: white;">${escapeHtml(lesson.title)}</h2>
                </div>
                <div class="arabic" style="color: white; opacity: 0.95;">${escapeHtml(lesson.titleArabic)}</div>
            </div>

            <div style="margin-top: 20px;">
                <p>${escapeHtml(lesson.content.introduction)}</p>
                <p class="arabic">${escapeHtml(lesson.content.introductionArabic)}</p>
            </div>

            <!-- Vocabulary -->
            <div class="vocabulary-section">
                <h3>📚 Vokabeln | المفردات</h3>
                <table class="vocab-table">
                    <thead>
                        <tr>
                            <th>Deutsch</th>
                            <th>العربية</th>
                            <th>Aussprache</th>
                        </tr>
                    </thead>
                    <tbody>
`;
        
        lesson.vocabulary.forEach(vocab => {
            html += `                        <tr>
                            <td>${escapeHtml(vocab.german)}</td>
                            <td>${escapeHtml(vocab.arabic)}</td>
                            <td>${escapeHtml(vocab.pronunciation)}</td>
                        </tr>
`;
        });

        html += `                    </tbody>
                </table>
            </div>

            <!-- Examples -->
            <div style="margin: 25px 0;">
                <h3>💡 Beispiele | أمثلة</h3>
`;

        lesson.examples.forEach((example, idx) => {
            html += `                <div class="example-box">
                    <div class="example-german">${idx + 1}. ${escapeHtml(example.german)}</div>
                    <div class="example-arabic">${escapeHtml(example.arabic)}</div>
                    <div class="example-explanation">${escapeHtml(example.explanation)}</div>
                </div>
`;
        });

        html += `            </div>

            <!-- Exercises -->
            <div style="margin: 25px 0;">
                <h3>✏️ Übungen | تمارين</h3>
`;

        lesson.exercises.forEach((exercise, idx) => {
            html += `                <div class="exercise-box">
                    <div style="font-weight: 600; margin-bottom: 5px;">${escapeHtml(exercise.question)}</div>
                    <div class="arabic" style="color: #92400e;">${escapeHtml(exercise.questionArabic)}</div>
                </div>
`;
        });

        html += `            </div>

            <div class="page-number">Seite ${4 + lessonIndex}</div>
        </div>
`;
    });

    // Final page
    html += `
        <!-- Final Page -->
        <div class="page page-break">
            <div class="cover-page" style="min-height: auto;">
                <h1 style="font-size: 32pt;">Herzlichen Glückwunsch!</h1>
                <p class="arabic" style="font-size: 28pt; margin: 20px 0;">مبروك!</p>
                <p style="font-size: 16pt; margin: 30px 0;">
                    Sie haben alle ${formData.lessons} Lektionen abgeschlossen.
                </p>
                <p style="font-size: 14pt;">
                    Viel Erfolg beim weiteren Lernen und bei Ihrer Integration in Deutschland!
                </p>
                <p class="arabic" style="font-size: 14pt; margin-top: 20px;">
                    حظاً موفقاً في مواصلة التعلم والاندماج في ألمانيا!
                </p>
                <div style="margin-top: 60px; font-size: 12pt;">
                    <p>© ${escapeHtml(formData.year)} ${escapeHtml(formData.author)}</p>
                    <p>Alle Rechte vorbehalten</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Optional: Auto-print on load
        // window.onload = () => { setTimeout(() => window.print(), 1000); };
    </script>
</body>
</html>`;

    return html;
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Download PDF
document.getElementById('downloadBtn').addEventListener('click', () => {
    if (generatedHTMLContent) {
        const fileName = document.getElementById('ebookTitle').value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'ebook';
        
        // Create blob and download
        const blob = new Blob([generatedHTMLContent], { type: 'text/html; charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show instructions
        alert('✅ E-Book wurde heruntergeladen!\n\n' +
              'So erstellen Sie eine PDF:\n' +
              '1. Öffnen Sie die heruntergeladene HTML-Datei in Ihrem Browser\n' +
              '2. Klicken Sie auf den "Als PDF speichern" Button ODER\n' +
              '3. Drücken Sie Strg+P (Cmd+P auf Mac)\n' +
              '4. Wählen Sie "Als PDF speichern" als Drucker\n' +
              '5. Klicken Sie auf "Speichern"\n\n' +
              'PDF تم تنزيل الكتاب الإلكتروني! افتح الملف في المتصفح واضغط على "حفظ كـ'
        );
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
