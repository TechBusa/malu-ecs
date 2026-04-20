import Alpine from 'alpinejs';
import { createIcons, icons } from 'lucide';

console.log("MECS Main Script Loading...");

const mecsAppData = () => {
    console.log("MECS App Data Factory invoked");
    return {
        isScrolled: false,
        isMobileMenuOpen: false,
        scrollProgress: 0,
        portfolioFilter: 'All',
        bimHover: false,
        chatOpen: false,
        chatInput: '',
        chatMessages: [
            { text: "Hello! I'm the MECS Assistant. How can I help you today?", sender: 'bot' }
        ],
        currentPage: 'home',
        isNavOpen: false,
        formSubmitted: false,
        lightboxOpen: false,
        lightboxIndex: 0,
        galleryImages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `/Image${i}.png`),
        formData: {
            name: '',
            email: '',
            phone: '',
            service: 'HVAC Engineering',
            projectType: 'Commercial',
            message: '',
            estimatedBudget: '',
            timeline: ''
        },
        services: [
            { 
                id: 'hvac', 
                title: 'HVAC Engineering', 
                description: 'Environmental control solutions through advanced cooling and heating load calculations.', 
                icon: 'wind', 
                details: ['Chiller plants', 'VRV/VRF systems', 'Ventilation Design'],
                caseStudy: {
                    project: 'Sandton Corporate Headquarters',
                    challenge: 'Cooling a 15-story glass-facade building efficiently.',
                    solution: 'Implemented a high-efficiency VRF system with heat recovery and integrated building automation.',
                    result: '35% reduction in annual HVAC energy consumption.'
                }
            },
            { 
                id: 'fire', 
                title: 'Fire Safety', 
                description: 'Comprehensive rational fire designs ensuring full compliance with SANS 10400-T regulation.', 
                icon: 'flame', 
                details: ['Fire Reports', 'Sprinkler design', 'Smoke Extraction'],
                caseStudy: {
                    project: 'Madala Hostel Development',
                    challenge: 'Securing a high-density R1.2 Billion residential complex.',
                    solution: 'Engineered a multi-zone rational fire design with optimized egress paths and high-capacity pump sets.',
                    result: 'Full regulatory approval and enhanced occupant safety.'
                }
            },
            { 
                id: 'wet', 
                title: 'Wet Services', 
                description: 'Optimized hydraulic design for sustainable water supply and drainage systems.', 
                icon: 'droplets', 
                details: ['Water supply', 'Hot water systems', 'Greywater reuse'],
                caseStudy: {
                    project: 'Helen Joseph Hospital Wing',
                    challenge: 'Specialized medical-grade water requirements for a new oncology unit.',
                    solution: 'Designed a dual-redundancy water reticulation network with integrated high-temperature hot water storage.',
                    result: 'Seamless integration with existing hospital infrastructure.'
                }
            },
            { 
                id: 'epcm', 
                title: 'EPCM & Management', 
                description: 'End-to-end turn-key project management, modernized for the industrial sector.', 
                icon: 'settings', 
                details: ['Project Management', 'Asset Optimization', 'Turn-key Delivery'],
                caseStudy: {
                    project: 'Sogara Refinery Modernization',
                    challenge: 'Updating legacy cooling systems without stopping production.',
                    solution: 'Phased EPCM delivery using 3D BIM coordination for pre-fabricated component fitting.',
                    result: '20% increase in cooling efficiency with zero site downtime.'
                }
            }
        ],
        faq: [
            { q: 'What services does MECS provide?', a: 'MECS specializes in Mechanical Consulting Engineering, including HVAC, Fire Safety, Wet Services, and EPCM.' },
            { q: 'Is MECS a black-owned company?', a: 'Yes, MECS is a 100% Black Owned company with a Level 1 B-BBEE status.' },
            { q: 'What is your experience level?', a: 'MECS is led by a registered Professional Engineer (PrEng) with over 12 years of experience.' }
        ],
        init() {
            console.log("MECS App State Initializing...");
            
            window.addEventListener('scroll', () => {
                this.isScrolled = window.scrollY > 50;
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                this.scrollProgress = height > 0 ? (winScroll / height) * 100 : 0;
            }, { passive: true });
            
            window.addEventListener('popstate', (e) => {
                if (e.state && e.state.page) {
                    this.currentPage = e.state.page;
                } else {
                    this.currentPage = 'home';
                }
                this.$nextTick(() => this.initIcons());
            });

            this.initIcons();
            console.log("MECS App Ready");
        },
        navigateTo(page) {
            this.currentPage = page;
            this.isMobileMenuOpen = false;
            window.scrollTo({ top: 0, behavior: 'instant' });
            
            this.$nextTick(() => {
                this.initIcons();
            });
            
            const hash = page === 'home' ? '' : `#${page}`;
            history.pushState({ page }, '', window.location.pathname + hash);
        },
        initIcons() {
            try {
                createIcons({ icons });
            } catch (e) {
                console.error("Lucide icons failed to init:", e);
            }
        },
        sendChatMessage() {
            if (!this.chatInput.trim()) return;
            const userMsg = this.chatInput;
            this.chatMessages.push({ text: userMsg, sender: 'user' });
            this.chatInput = '';
            
            setTimeout(() => {
                const response = this.getBotResponse(userMsg);
                this.chatMessages.push({ text: response, sender: 'bot' });
                this.$nextTick(() => {
                    const container = this.$refs.chatContainer;
                    if (container) container.scrollTop = container.scrollHeight;
                });
            }, 300);
        },
        getBotResponse(input) {
            const query = input.toLowerCase();
            const kb = {
                hvac: {
                    general: "Our HVAC division specializes in critical environmental control. We design high-efficiency VRV/VRF systems, Centralized Chiller plants, and cleanroom ventilation.",
                    projects: "One of our flagship projects was the Sandton Corporate Headquarters, achieving a 35% reduction in energy costs.",
                    keywords: ['hvac', 'air con', 'cooling', 'ventilation', 'heating', 'ac']
                },
                fire: {
                    general: "MECS provides Professional Rational Fire Designs under SANS 10400-T. We engineer active and passive fire protection systems.",
                    projects: "We led the fire engineering for the R1.2 Billion Madala Hostel development.",
                    keywords: ['fire', 'safety', 'sprinkler', 'suppression', 'smoke', 'sans 10400-t']
                },
                wet: {
                    general: "Our Wet Services team handles hydraulic design for domestic water, soil, and waste reticulation.",
                    projects: "At Helen Joseph Hospital, we engineered the medical-grade water reticulation for the oncology wing.",
                    keywords: ['wet', 'water', 'plumbing', 'drainage', 'sewer', 'hydraulic']
                },
                epcm: {
                    general: "EPCM at MECS involves end-to-end Project Management from 3D BIM coordination to certification.",
                    projects: "Our portfolio includes the Sogara Oil Refinery modernization in Gabon.",
                    keywords: ['epcm', 'management', 'project', 'consulting', 'procurement']
                }
            };

            for (const category in kb) {
                if (kb[category].keywords.some(k => query.includes(k))) {
                    if (query.includes('project') || query.includes('example')) return kb[category].projects;
                    return kb[category].general;
                }
            }

            if (query.includes('hello') || query.includes('hi')) return "Hi! I'm the MECS Assistant. How can I help you today?";
            if (query.includes('contact')) return "Reach Michael Maluleka at +27 71 880 2302 or Michael@Maluleka-ecs.co.za.";
            
            return "I can provide information on our HVAC, Fire Safety, Wet Services, or EPCM expertise.";
        },
        prevLightboxImage() {
            this.lightboxIndex = (this.lightboxIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
        },
        openLightbox(index) {
            this.lightboxIndex = index;
            this.lightboxOpen = true;
            document.body.style.overflow = 'hidden';
            this.$nextTick(() => this.initIcons());
        },
        closeLightbox() {
            this.lightboxOpen = false;
            document.body.style.overflow = '';
        },
        nextLightboxImage() {
            this.lightboxIndex = (this.lightboxIndex + 1) % this.galleryImages.length;
        },
        sendViaEmail() {
            const subject = `Quote Request: ${this.formData.service}`;
            const body = `Name: ${this.formData.name}\nEmail: ${this.formData.email}\nService: ${this.formData.service}\n\nMessage:\n${this.formData.message}`;
            window.location.href = `mailto:Michael@Maluleka-ecs.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        },
        sendViaWhatsApp() {
            const text = `*New Quote Request*\n*Name:* ${this.formData.name}\n*Service:* ${this.formData.service}`;
            window.open(`https://wa.me/27718802302?text=${encodeURIComponent(text)}`, '_blank');
        }
    };
};

// Register Alpine Data
Alpine.plugin((Alpine) => {
    Alpine.data('mecsApp', mecsAppData);
});

// Start Alpine
window.Alpine = Alpine;
Alpine.start();

window.lucide = { createIcons, icons };
