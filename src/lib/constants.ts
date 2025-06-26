export const LOCAL_STORAGE_TRANSCRIPT_KEY = 'simu-interview-transcript';

export const ROLE_BASED_INTERVIEW_QUESTIONS: Record<string, Record<string, string[]>> = {
    en: {
        General: [
            "Can you tell me a little about yourself?",
            "What are your biggest strengths?",
            "What are your biggest weaknesses?",
            "Tell me about a time you faced a significant challenge at work and how you handled it.",
            "Where do you see yourself in 5 years?",
            "Why are you interested in this role and our company?",
            "Do you have any questions for me?"
        ],
        'Software Engineer': [
            "Describe a challenging technical problem you solved recently.",
            "How do you approach system design? Can you walk me through designing a simple URL shortener?",
            "What's your experience with agile development methodologies?",
            "How do you ensure the quality of your code?",
            "Tell me about a time you had a disagreement with a team member on a technical decision.",
            "What are you learning right now?"
        ],
        'Product Manager': [
            "How would you improve one of our products?",
            "Describe a successful product you launched from start to finish.",
            "How do you prioritize features when you have limited resources?",
            "Tell me about a time a product launch didn't go as planned. What happened and what did you learn?",
            "How do you use data to make decisions?",
            "How do you handle disagreements with stakeholders, like engineering or sales?"
        ],
        'Marketing Manager': [
            "Describe a successful marketing campaign you managed. What were the key metrics?",
            "How do you stay up-to-date with the latest marketing trends?",
            "What's your experience with budget management for marketing campaigns?",
            "How would you approach marketing a new product in a competitive market?",
            "Tell me about a time you used data to optimize a campaign.",
            "How do you collaborate with sales and product teams?"
        ],
        'Sales Representative': [
            "Walk me through your sales process.",
            "How do you handle objections from a potential customer?",
            "Describe a time you successfully closed a difficult deal.",
            "How do you research and qualify leads?",
            "What are the most important qualities of a successful salesperson?",
            "How do you motivate yourself to meet and exceed sales targets?"
        ]
    },
    ja: {
        General: [
            "自己紹介を少ししていただけますか？",
            "あなたの最大の強みは何ですか？",
            "あなたの最大の弱みは何ですか？",
            "仕事で大きな課題に直面し、それをどのように乗り越えたかについて教えてください。",
            "5年後のご自身の姿をどのように思い描いていますか？",
            "なぜこの役職と当社に興味を持たれたのですか？",
            "何か質問はありますか？"
        ],
        'Software Engineer': [
            "最近解決した技術的に困難だった問題について説明してください。",
            "システム設計にどのようにアプローチしますか？簡単なURL短縮サービスの設計を説明していただけますか？",
            "アジャイル開発手法の経験について教えてください。",
            "コードの品質をどのように保証していますか？",
            "技術的な決定についてチームメンバーと意見が対立した時のことを教えてください。",
            "現在、何を学んでいますか？"
        ],
        'Product Manager': [
            "当社の製品をどのように改善しますか？",
            "最初から最後まで担当し、成功した製品の立ち上げについて説明してください。",
            "リソースが限られている場合、機能の優先順位をどのように決定しますか？",
            "製品の立ち上げが計画通りに進まなかった時のことを教えてください。何が起こり、何を学びましたか？",
            "意思決定にデータをどのように活用しますか？",
            "エンジニアリングやセールスなどのステークホルダーとの意見の相違にどのように対処しますか？"
        ],
        'Marketing Manager': [
            "担当した成功したマーケティングキャンペーンについて説明してください。主要な指標は何でしたか？",
            "最新のマーケティングトレンドをどのように把握していますか？",
            "マーケティングキャンペーンの予算管理の経験について教えてください。",
            "競争の激しい市場で新製品をマーケティングする際に、どのようにアプローチしますか？",

            "データを活用してキャンペーンを最適化した時のことを教えてください。",
            "セールスチームや製品チームとどのように協力していますか？"
        ],
        'Sales Representative': [
            "あなたのセールスプロセスを説明してください。",
            "見込み客からの反対意見にどのように対処しますか？",
            "困難な取引を成功裏にまとめた時のことを説明してください。",
            "リードをどのように調査し、適格性を判断しますか？",
            "成功する営業担当者の最も重要な資質は何だと思いますか？",
            "販売目標を達成し、超えるためにどのように自己を動機づけていますか？"
        ]
    },
    ko: {
        General: [
            "자기소개를 간단히 해주시겠어요?",
            "가장 큰 장점은 무엇인가요?",
            "가장 큰 단점은 무엇인가요?",
            "업무 중 중요한 도전에 직면했을 때 어떻게 대처했는지 말씀해주세요.",
            "5년 후 자신의 모습은 어떨 것이라고 생각하시나요?",
            "이 직무와 저희 회사에 관심을 갖게 된 이유는 무엇인가요?",
            "질문 있으신가요?"
        ],
        'Software Engineer': [
            "최근에 해결한 기술적으로 어려웠던 문제에 대해 설명해주세요.",
            "시스템 설계에 어떻게 접근하시나요? 간단한 URL 단축 서비스 설계를 설명해주시겠어요?",
            "애자일 개발 방법론에 대한 경험은 어떠신가요?",
            "코드 품질을 어떻게 보장하시나요?",
            "기술적 결정에 대해 팀원과 의견이 달랐던 경험에 대해 말씀해주세요.",
            "지금 무엇을 배우고 계신가요?"
        ],
        'Product Manager': [
            "저희 제품 중 하나를 어떻게 개선하시겠어요?",
            "처음부터 끝까지 성공적으로 출시한 제품에 대해 설명해주세요.",
            "한정된 리소스로 기능의 우선순위를 어떻게 정하시나요?",
            "제품 출시가 계획대로 되지 않았던 경험에 대해 말씀해주세요. 무슨 일이 있었고 무엇을 배웠나요?",
            "의사결정을 위해 데이터를 어떻게 사용하시나요?",
            "엔지니어링이나 영업 같은 이해관계자들과의 의견 불일치를 어떻게 해결하시나요?"
        ],
        'Marketing Manager': [
            "관리했던 성공적인 마케팅 캠페인에 대해 설명해주세요. 핵심 지표는 무엇이었나요?",
            "최신 마케팅 트렌드를 어떻게 파악하시나요?",
            "마케팅 캠페인 예산 관리에 대한 경험은 어떠신가요?",
            "경쟁이 치열한 시장에서 신제품을 어떻게 마케팅하시겠어요?",
            "데이터를 사용해 캠페인을 최적화했던 경험에 대해 말씀해주세요.",
            "영업 및 제품 팀과 어떻게 협력하시나요?"
        ],
        'Sales Representative': [
            "당신의 영업 프로세스를 설명해주세요.",
            "잠재 고객의 반대 의견을 어떻게 처리하시나요?",
            "어려운 거래를 성공적으로 성사시켰던 경험에 대해 설명해주세요.",
            "리드를 어떻게 조사하고 자격을 부여하시나요?",
            "성공적인 영업사원의 가장 중요한 자질은 무엇이라고 생각하시나요?",
            "판매 목표를 달성하고 초과 달성하기 위해 어떻게 자신을 동기 부여하시나요?"
        ]
    },
    zh: {
        General: [
            "能简单介绍一下你自己吗？",
            "你最大的优点是什么？",
            "你最大的缺点是什么？",
            "请讲一次你在工作中遇到的重大挑战以及你是如何应对的。",
            "你如何看待未来5年的自己？",
            "你为什么对这个职位和我们公司感兴趣？",
            "你有什么问题要问我吗？"
        ],
        'Software Engineer': [
            "请描述一个你最近解决的具有挑战性的技术问题。",
            "你如何进行系统设计？可以给我讲解一下如何设计一个简单的URL缩短服务吗？",
            "你在敏捷开发方法方面有什么经验？",
            "你如何保证代码质量？",
            "请讲一次你和团队成员在技术决策上意见不合的经历。",
            "你目前正在学习什么？"
        ],
        'Product Manager': [
            "你会如何改进我们的某一款产品？",
            "请描述一个你从头到尾成功发布的产品。",
            "当资源有限时，你如何确定功能的优先级？",
            "请讲一次产品发布未按计划进行的经历。发生了什么，你学到了什么？",
            "你如何利用数据做决策？",
            "你如何处理与工程或销售等利益相关者的分歧？"
        ],
        'Marketing Manager': [
            "请描述一个你管理的成功的营销活动。关键指标是什么？",
            "你如何跟上最新的营销趋势？",
            "你在营销活动的预算管理方面有什么经验？",
            "在一个竞争激烈的市场中，你会如何推广一个新产品？",
            "请讲一次你利用数据优化营销活动的经历。",
            "你如何与销售和产品团队合作？"
        ],
        'Sales Representative': [
            "请介绍一下你的销售流程。",
            "你如何处理潜在客户的异议？",
            "请描述一次你成功完成一笔困难交易的经历。",
            "你如何研究和筛选潜在客户？",
            "你认为一个成功的销售人员最重要的品质是什么？",
            "你如何激励自己达到并超越销售目标？"
        ]
    },
    th: {
        General: [
            "ช่วยแนะนำตัวเองหน่อยได้ไหมครับ/คะ",
            "จุดแข็งที่สุดของคุณคืออะไร",
            "จุดอ่อนที่สุดของคุณคืออะไร",
            "เล่าถึงช่วงเวลาที่คุณเผชิญกับความท้าทายที่สำคัญในที่ทำงานและคุณรับมือกับมันอย่างไร",
            "คุณเห็นตัวเองอยู่ที่ไหนในอีก 5 ปีข้างหน้า",
            "ทำไมคุณถึงสนใจในตำแหน่งนี้และบริษัทของเรา",
            "มีคำถามอะไรจะถามผม/ดิฉันไหมครับ/คะ"
        ],
        'Software Engineer': [
            "อธิบายปัญหาทางเทคนิคที่ท้าทายที่คุณแก้ไขได้ล่าสุด",
            "คุณมีแนวทางในการออกแบบระบบอย่างไร ช่วยอธิบายการออกแบบบริการย่อ URL แบบง่ายๆ ได้ไหม",
            "คุณมีประสบการณ์เกี่ยวกับ phương pháp phát triển Agile อย่างไรบ้าง",
            "คุณแน่ใจในคุณภาพของโค้ดของคุณได้อย่างไร",
            "เล่าถึงช่วงเวลาที่คุณมีความขัดแย้งกับสมาชิกในทีมเกี่ยวกับการตัดสินใจทางเทคนิค",
            "ตอนนี้คุณกำลังเรียนรู้อะไรอยู่"
        ],
        'Product Manager': [
            "คุณจะปรับปรุงผลิตภัณฑ์ของเราอย่างไร",
            "อธิบายผลิตภัณฑ์ที่ประสบความสำเร็จที่คุณเปิดตัวตั้งแต่ต้นจนจบ",
            "คุณจัดลำดับความสำคัญของคุณสมบัติต่างๆ อย่างไรเมื่อมีทรัพยากรจำกัด",
            "เล่าถึงช่วงเวลาที่การเปิดตัวผลิตภัณฑ์ไม่เป็นไปตามแผน เกิดอะไรขึ้นและคุณได้เรียนรู้อะไร",
            "คุณใช้ข้อมูลในการตัดสินใจอย่างไร",
            "คุณจัดการกับความขัดแย้งกับผู้มีส่วนได้ส่วนเสีย เช่น ฝ่ายวิศวกรรมหรือฝ่ายขายอย่างไร"
        ],
        'Marketing Manager': [
            "อธิบายแคมเปญการตลาดที่ประสบความสำเร็จที่คุณจัดการ ตัวชี้วัดสำคัญคืออะไร",
            "คุณติดตามเทรนด์การตลาดล่าสุดอยู่เสมอได้อย่างไร",
            "คุณมีประสบการณ์เกี่ยวกับการจัดการงบประมาณสำหรับแคมเปญการตลาดอย่างไร",
            "คุณจะมีแนวทางในการทำตลาดผลิตภัณฑ์ใหม่ในตลาดที่มีการแข่งขันสูงอย่างไร",
            "เล่าถึงช่วงเวลาที่คุณใช้ข้อมูลเพื่อเพิ่มประสิทธิภาพแคมเปญ",
            "คุณทำงานร่วมกับทีมขายและทีมผลิตภัณฑ์อย่างไร"
        ],
        'Sales Representative': [
            "อธิบายกระบวนการขายของคุณให้ฟังหน่อย",
            "คุณจัดการกับการปฏิเสธจากลูกค้าเป้าหมายอย่างไร",
            "อธิบายช่วงเวลาที่คุณปิดการขายที่ยากลำบากได้สำเร็จ",
            "คุณค้นหาและคัดเลือกผู้มุ่งหวังอย่างไร",
            "คุณคิดว่าคุณสมบัติที่สำคัญที่สุดของพนักงานขายที่ประสบความสำเร็จคืออะไร",
            "คุณกระตุ้นตัวเองให้บรรลุและเกินเป้าหมายการขายได้อย่างไร"
        ]
    },
    ms: {
        General: [
            "Boleh terangkan sedikit tentang diri anda?",
            "Apakah kekuatan terbesar anda?",
            "Apakah kelemahan terbesar anda?",
            "Ceritakan tentang satu masa anda menghadapi cabaran besar di tempat kerja dan bagaimana anda menanganinya.",
            "Di manakah anda melihat diri anda dalam 5 tahun akan datang?",
            "Mengapakah anda berminat dengan jawatan ini dan syarikat kami?",
            "Adakah anda mempunyai sebarang soalan untuk saya?"
        ],
        'Software Engineer': [
            "Terangkan masalah teknikal yang mencabar yang anda selesaikan baru-baru ini.",
            "Bagaimanakah pendekatan anda terhadap reka bentuk sistem? Boleh anda terangkan cara mereka bentuk pemendek URL yang mudah?",
            "Apakah pengalaman anda dengan metodologi pembangunan tangkas?",
            "Bagaimanakah anda memastikan kualiti kod anda?",
            "Ceritakan tentang masa anda mempunyai perselisihan faham dengan ahli pasukan mengenai keputusan teknikal.",
            "Apakah yang sedang anda pelajari sekarang?"
        ],
        'Product Manager': [
            "Bagaimanakah anda akan menambah baik salah satu produk kami?",
            "Terangkan produk yang berjaya anda lancarkan dari awal hingga akhir.",
            "Bagaimanakah anda mengutamakan ciri-ciri apabila anda mempunyai sumber yang terhad?",
            "Ceritakan tentang masa pelancaran produk tidak berjalan seperti yang dirancang. Apa yang berlaku dan apa yang anda pelajari?",
            "Bagaimanakah anda menggunakan data untuk membuat keputusan?",
            "Bagaimanakah anda menangani perselisihan faham dengan pihak berkepentingan, seperti kejuruteraan atau jualan?"
        ],
        'Marketing Manager': [
            "Terangkan kempen pemasaran yang berjaya yang anda uruskan. Apakah metrik utamanya?",
            "Bagaimanakah anda mengikuti trend pemasaran terkini?",
            "Apakah pengalaman anda dengan pengurusan bajet untuk kempen pemasaran?",
            "Bagaimanakah pendekatan anda untuk memasarkan produk baharu dalam pasaran yang kompetitif?",
            "Ceritakan tentang masa anda menggunakan data untuk mengoptimumkan kempen.",
            "Bagaimanakah anda bekerjasama dengan pasukan jualan dan produk?"
        ],
        'Sales Representative': [
            "Jelaskan proses jualan anda.",
            "Bagaimanakah anda menangani bantahan daripada bakal pelanggan?",
            "Terangkan masa anda berjaya menutup perjanjian yang sukar.",
            "Bagaimanakah anda menyelidik dan melayakkan prospek?",
            "Apakah kualiti terpenting bagi seorang jurujual yang berjaya?",
            "Bagaimanakah anda memotivasikan diri anda untuk mencapai dan melebihi sasaran jualan?"
        ]
    },
    id: {
        General: [
            "Bisakah Anda menceritakan sedikit tentang diri Anda?",
            "Apa kekuatan terbesar Anda?",
            "Apa kelemahan terbesar Anda?",
            "Ceritakan tentang saat Anda menghadapi tantangan signifikan di tempat kerja dan bagaimana Anda menanganinya.",
            "Di mana Anda melihat diri Anda dalam 5 tahun ke depan?",
            "Mengapa Anda tertarik dengan peran ini dan perusahaan kami?",
            "Apakah Anda punya pertanyaan untuk saya?"
        ],
        'Software Engineer': [
            "Jelaskan masalah teknis menantang yang baru saja Anda selesaikan.",
            "Bagaimana pendekatan Anda terhadap desain sistem? Bisakah Anda menjelaskan cara merancang pemendek URL sederhana?",
            "Apa pengalaman Anda dengan metodologi pengembangan agile?",
            "Bagaimana Anda memastikan kualitas kode Anda?",
            "Ceritakan tentang saat Anda berselisih pendapat dengan anggota tim mengenai keputusan teknis.",
            "Apa yang sedang Anda pelajari saat ini?"
        ],
        'Product Manager': [
            "Bagaimana Anda akan meningkatkan salah satu produk kami?",
            "Jelaskan produk sukses yang Anda luncurkan dari awal hingga akhir.",
            "Bagaimana Anda memprioritaskan fitur ketika sumber daya terbatas?",
            "Ceritakan tentang saat peluncuran produk tidak berjalan sesuai rencana. Apa yang terjadi dan apa yang Anda pelajari?",
            "Bagaimana Anda menggunakan data untuk membuat keputusan?",
            "Bagaimana Anda menangani perselisihan dengan pemangku kepentingan, seperti rekayasa atau penjualan?"
        ],
        'Marketing Manager': [
            "Jelaskan kampanye pemasaran sukses yang Anda kelola. Apa metrik utamanya?",
            "Bagaimana Anda mengikuti tren pemasaran terbaru?",
            "Apa pengalaman Anda dengan manajemen anggaran untuk kampanye pemasaran?",
            "Bagaimana Anda akan mendekati pemasaran produk baru di pasar yang kompetitif?",
            "Ceritakan tentang saat Anda menggunakan data untuk mengoptimalkan kampanye.",
            "Bagaimana Anda berkolaborasi dengan tim penjualan dan produk?"
        ],
        'Sales Representative': [
            "Jelaskan proses penjualan Anda.",
            "Bagaimana Anda menangani keberatan dari calon pelanggan?",
            "Jelaskan saat Anda berhasil menutup kesepakatan yang sulit.",
            "Bagaimana Anda meneliti dan memenuhi syarat prospek?",
            "Apa kualitas terpenting dari seorang tenaga penjualan yang sukses?",
            "Bagaimana Anda memotivasi diri sendiri untuk memenuhi dan melampaui target penjualan?"
        ]
    },
    vi: {
        General: [
            "Bạn có thể giới thiệu một chút về bản thân được không?",
            "Điểm mạnh lớn nhất của bạn là gì?",
            "Điểm yếu lớn nhất của bạn là gì?",
            "Hãy kể về một lần bạn đối mặt với một thách thức lớn trong công việc và cách bạn xử lý nó.",
            "Bạn thấy mình ở đâu trong 5 năm tới?",
            "Tại sao bạn quan tâm đến vai trò này và công ty của chúng tôi?",
            "Bạn có câu hỏi nào cho tôi không?"
        ],
        'Software Engineer': [
            "Hãy mô tả một vấn đề kỹ thuật đầy thách thức mà bạn đã giải quyết gần đây.",
            "Bạn tiếp cận thiết kế hệ thống như thế nào? Bạn có thể hướng dẫn tôi thiết kế một dịch vụ rút gọn URL đơn giản không?",
            "Kinh nghiệm của bạn với các phương pháp phát triển linh hoạt (agile) là gì?",
            "Làm thế nào để bạn đảm bảo chất lượng mã của mình?",
            "Hãy kể về một lần bạn có bất đồng với một thành viên trong nhóm về một quyết định kỹ thuật.",
            "Bạn đang học gì vào thời điểm này?"
        ],
        'Product Manager': [
            "Bạn sẽ cải thiện một trong những sản phẩm của chúng tôi như thế nào?",
            "Hãy mô tả một sản phẩm thành công mà bạn đã ra mắt từ đầu đến cuối.",
            "Làm thế nào để bạn ưu tiên các tính năng khi có nguồn lực hạn chế?",
            "Hãy kể về một lần ra mắt sản phẩm không theo kế hoạch. Chuyện gì đã xảy ra và bạn đã học được gì?",
            "Bạn sử dụng dữ liệu để đưa ra quyết định như thế nào?",
            "Làm thế nào để bạn xử lý những bất đồng với các bên liên quan, như kỹ thuật hoặc bán hàng?"
        ],
        'Marketing Manager': [
            "Hãy mô tả một chiến dịch tiếp thị thành công mà bạn đã quản lý. Các chỉ số chính là gì?",
            "Làm thế nào để bạn cập nhật các xu hướng tiếp thị mới nhất?",
            "Kinh nghiệm của bạn về quản lý ngân sách cho các chiến dịch tiếp thị là gì?",
            "Bạn sẽ tiếp cận việc tiếp thị một sản phẩm mới trong một thị trường cạnh tranh như thế nào?",
            "Hãy kể về một lần bạn sử dụng dữ liệu để tối ưu hóa một chiến dịch.",
            "Bạn hợp tác với các nhóm bán hàng và sản phẩm như thế nào?"
        ],
        'Sales Representative': [
            "Hãy trình bày quy trình bán hàng của bạn.",
            "Làm thế nào để bạn xử lý sự phản đối từ một khách hàng tiềm năng?",
            "Hãy mô tả một lần bạn đã chốt thành công một hợp đồng khó khăn.",
            "Làm thế nào để bạn nghiên cứu và đánh giá khách hàng tiềm năng?",
            "Theo bạn, những phẩm chất quan trọng nhất của một nhân viên bán hàng thành công là gì?",
            "Làm thế nào để bạn tự tạo động lực để đạt và vượt chỉ tiêu bán hàng?"
        ]
    }
};
