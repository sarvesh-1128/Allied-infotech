// Centralized Database Content Layer for Allied-Iconic & Allied Infotech
// Strictly populated using the PowerPoint presentation as the primary source of truth.

// Logos
import alliedIconicLogo from '../assets/images/logos/allied_iconic_logo.webp';
import szyLogo from '../assets/images/logos/szy_logo.webp';
import szyBadge from '../assets/images/logos/szy_badge.webp';

// Certificates
import shangzhiyouAuth from '../assets/images/certificates/shangzhiyou_auth.webp';
import kongerAuth from '../assets/images/certificates/konger_auth.webp';
import mopuAuth from '../assets/images/certificates/mopu_auth.webp';
import antBrotherAuth from '../assets/images/certificates/ant_brother_auth.webp';

// Products
import hydraulicClampSystem from '../assets/images/products/hydraulic_clamp_system.webp';
import clampUnit1 from '../assets/images/products/clamp_unit_1.webp';
import clampUnit2 from '../assets/images/products/clamp_unit_2.webp';
import hydraulicQmcInstalled1 from '../assets/images/products/hydraulic_qmc_installed_1.webp';
import hydraulicQmcInstalled2 from '../assets/images/products/hydraulic_qmc_installed_2.webp';
import mouldCleaningMachineFront from '../assets/images/products/mould_cleaning_machine_front.webp';
import mouldCleaningMachineActive from '../assets/images/products/mould_cleaning_machine_active.webp';
import mouldCleaningBucket from '../assets/images/products/mould_cleaning_bucket.webp';
import mouldCleaningScreen from '../assets/images/products/mould_cleaning_screen.webp';
import mouldCleaningDebris from '../assets/images/products/mould_cleaning_debris.webp';
import mouldCleaningDirtyWater from '../assets/images/products/mould_cleaning_dirty_water.webp';
import mouldCleaningCleanPipe from '../assets/images/products/mould_cleaning_clean_pipe.webp';
import screwBarrelRender1 from '../assets/images/products/screw_barrel_render_1.webp';
import screwBarrelRender2 from '../assets/images/products/screw_barrel_render_2.webp';
import shutOffNozzleRender1 from '../assets/images/products/shut_off_nozzle_render_1.webp';
import shutOffNozzleRender2 from '../assets/images/products/shut_off_nozzle_render_2.webp';

// Gallery
import anhuiReception from '../assets/images/gallery/anhui_reception.webp';
import mouldPlateCores from '../assets/images/gallery/mould_plate_cores.webp';
import immFactoryFloor from '../assets/images/gallery/imm_factory_floor.webp';
import officeMeeting1 from '../assets/images/gallery/office_meeting_1.webp';
import assemblyFloorQmcBed from '../assets/images/gallery/assembly_floor_qmc_bed.webp';
import factoryBuildingExterior1 from '../assets/images/gallery/factory_building_exterior_1.webp';
import factoryBuildingExterior2 from '../assets/images/gallery/factory_building_exterior_2.webp';
import briefIntroductionHall from '../assets/images/gallery/brief_introduction_hall.webp';
import verticalImmRow from '../assets/images/gallery/vertical_imm_row.webp';
import productionHallVerticalImms from '../assets/images/gallery/production_hall_vertical_imms.webp';
import wrappedVerticalImm from '../assets/images/gallery/wrapped_vertical_imm.webp';
import officeMeeting2 from '../assets/images/gallery/office_meeting_2.webp';
import antBrotherTeamGroup from '../assets/images/gallery/ant_brother_team_group.webp';
import threeMenGroup from '../assets/images/gallery/three_men_group.webp';
import lobbyTeamGroup from '../assets/images/gallery/lobby_team_group.webp';
import factoryWorkersImm from '../assets/images/gallery/factory_workers_imm.webp';
import twoMenLobby from '../assets/images/gallery/two_men_lobby.webp';

export interface Product {
  id: string;
  name: string;
  division: 'moulding' | 'manufacturing';
  images: string[];
  overview: string;
  applications: string[];
  advantages: string[];
  industries: string[];
  specifications: Record<string, string>;
  brochurePath?: string;
}

export interface Partner {
  id: string;
  name: string;
  logo?: string;
  country: string;
  overview: string;
  technologies: string[];
  categories: string[];
  engineeringCapabilities: string[];
  certificatePath?: string;
  website: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  category: 'facilities' | 'production' | 'visits' | 'machines';
  alt: string;
  caption: string;
}

export interface LeadershipMember {
  name: string;
  role: string;
  experience: string;
  qualification: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'IT/ITES' | 'Consultancy';
  description: string;
  details: string[];
  icon: string;
}

// Database Export
export const db = {
  company: {
    name: "Allied-Iconic Pvt. Ltd.",
    logo: alliedIconicLogo,
    division: "Allied Infotech",
    tagline: "Industrial Technology & Precision Engineering Solutions",
    established: 2021, // Established in 2021 as verified in PPT Slide 2
    address: {
      registered: "No.26, Venkateshwara Street, Chelliamman Nagar, Athipet, Chennai - 600058, India" // Verified from Slide 4
    },
    emails: ["info@allied-iconic.com"], // Verified from Slide 1
    phones: ["+91 8144723651"], // Verified from Slide 1
    overview: "Allied-Iconic Pvt. Ltd., operating with its technology division Allied Infotech, was established in the year 2021 by a board of experienced technocrats. The company offers specialized engineering support and distribution services for the injection moulding industry, automotive sector, construction, infrastructure, and IT-enabled services. We represent leading global manufacturing principals in India.",
    vision: "To deliver world-class engineering technologies and automated production solutions, raising manufacturing efficiency and standards across India's industrial sector.",
    mission: "To supply high-precision mould change systems, wear-resistant barrels, eco-safe descaling units, and integration consultancies, enabling zero-defect manufacturing operations.",
    competencies: [
      "Founded and directed by technocrats with 3 decades of work experience with major industry leaders.",
      "Direct technical and trade representations for global manufacturing partners.",
      "High-precision product configuration and troubleshooting for horizontal/vertical molding systems.",
      "Expert integration services spanning industrial mechanics, tooling design, and ITES supplier linkages."
    ],
    industries: [
      { name: "Engineering Industries", description: "Precision components, tooling assemblies, and machine accessories." },
      { name: "Automotive Sector", description: "Insert-molded electronics, trims, and specialized tooling." },
      { name: "Construction & Infrastructure", description: "Heavy-duty structural components and custom machinery." },
      { name: "IT-Enabled Services", description: "SAP S/4HANA migrations, ERP implementations, and supplier link APIs." }
    ]
  },

  leadership: [
    {
      name: "Managing Director / Technocrat Board Member",
      role: "Board Director",
      experience: "3 Decades (30 Years)",
      qualification: "Seasoned Engineering Professional",
      description: "Brings three decades of experience working with major national and global manufacturing industry leaders, directing business development and strategic partnerships."
    },
    {
      name: "Technical Director / Technocrat Board Member",
      role: "Board Director",
      experience: "3 Decades (30 Years)",
      qualification: "Seasoned Engineering Professional",
      description: "Experienced in engineering systems, tooling validation, and manufacturing installations, directing Chennai service operations and local client configurations."
    }
  ] as LeadershipMember[],

  products: [
    {
      id: "hydraulic-qmc",
      name: "Hydraulic Quick Mold Change (QMC) System",
      division: "manufacturing",
      images: [hydraulicClampSystem, clampUnit1, clampUnit2, hydraulicQmcInstalled1, szyBadge],
      overview: "Represented via Kunshan Shangzhiyou Precision (SZY), this hydraulic clamping system is designed to minimize machine idle time during changeovers (SMED). The kit includes robust hydraulic clamp blocks, die arms, mould lifts, and complete exchange trolleys.",
      applications: [
        "Automotive moulding lines requiring frequent tool changeovers",
        "Large-tonnage horizontal injection moulding machines",
        "Production environments adopting Single-Minute Exchange of Die (SMED) principles"
      ],
      advantages: [
        "Reduces mould changeover time by up to 80%",
        "Uniform clamping force minimizes tool wear and prevents alignment shifts",
        "High safety margins with integrated check-valves and pressure monitoring sensors"
      ],
      industries: ["Automotive", "Appliances", "Heavy Industry"],
      specifications: {
        "Clamping Force": "Custom fit (up to 3000 Ton IMM)",
        "System components": "Clamping plates, hydraulic power units, control box, die arms, mold lift",
        "Operating Pressure": "Up to 250 Bar",
        "Safety Standard": "CE certified safety logic"
      }
    },
    {
      id: "magnetic-qmc",
      name: "Magnetic Quick Mold Change (QMC) System",
      division: "manufacturing",
      images: [hydraulicQmcInstalled2],
      overview: "An advanced, wear-free electro-permanent magnetic clamping plate system that secures moulds in seconds without mechanical clamping components. Requires electricity only during clamping and unclamping phases.",
      applications: [
        "High-efficiency production shops with standardized moulds",
        "Fast-turnaround consumer goods and packaging manufacturing",
        "Horizontal moulding lines requiring tool swaps without modification of backing plates"
      ],
      advantages: [
        "Clamps the entire mould backing plate uniformly, preventing deformation",
        "Fail-safe: Clamping force remains active during power failure",
        "No moving mechanical parts, ensuring zero maintenance costs"
      ],
      industries: ["Packaging", "Electronics", "Automotive"],
      specifications: {
        "Clamping Plate Thickness": "Approx. 45 - 55 mm",
        "Clamping Strength": "15-18 kg/cm² magnetic force",
        "Unclamping Cycle": "Less than 2 seconds",
        "Safety Interlock": "Integrated magnetic flux sensor & IMM link interface"
      }
    },
    {
      id: "screw-barrel",
      name: "Nitrided Screw and Barrel Systems",
      division: "manufacturing",
      images: [screwBarrelRender1],
      overview: "High-grade nitrided screw and barrel components manufactured by Rootier Industry. Engineered for long-term consistency in standard plastic injection and extrusion systems.",
      applications: [
        "Standard polymer injection moulding (PP, PE, PS)",
        "General purpose extrusion lines",
        "Replacement components for global IMM brands"
      ],
      advantages: [
        "Deep nitrided layer provides excellent surface hardness (HV 900+)",
        "Precision machined flight profiles for homogeneous melt quality",
        "Excellent price-to-performance ratio for non-corrosive polymers"
      ],
      industries: ["Packaging", "Consumer Plastics", "Industrial Profiles"],
      specifications: {
        "Material": "SACM 645 / 38CrMoAlA steel",
        "Nitride Depth": "0.5mm to 0.8mm",
        "Nitride Hardness": "HV 950 - 1050",
        "Screw Diameters": "15mm to 250mm"
      }
    },
    {
      id: "bi-metallic-screw-barrel",
      name: "Bi-Metallic Screw and Barrel Systems",
      division: "manufacturing",
      images: [screwBarrelRender2],
      overview: "Premium wear and corrosion resistant screw and barrel systems. Features a centrifugal cast alloy lining in the barrel and special PTA alloy overlays on the screw flights, offering 3 to 5 times the operational life of nitrided components.",
      applications: [
        "Processing of abrasive materials (glass-fiber reinforced polymers)",
        "Processing of corrosive polymers (PVC, Halogen-free flame retardant compounds)",
        "Continuous 24/7 high-speed production environments"
      ],
      advantages: [
        "Unmatched wear resistance against glass fibers and mineral fillers",
        "Superior corrosion resistance against acidic gas byproducts during melting",
        "Significantly decreases downtime and scrap rates over time"
      ],
      industries: ["Automotive", "Medical", "Electronics", "Chemical Processing"],
      specifications: {
        "Base Material": "42CrMo / 38CrMoAlA",
        "Alloy Layer Options": "Fe-based, Ni-based, Co-based, Tungsten Carbide matrix",
        "Centrifugal Casting Thickness": "2.0mm to 3.5mm",
        "Surface Hardness": "HRC 58 - 65"
      }
    },
    {
      id: "shut-off-nozzles",
      name: "Special Shut-Off Nozzles",
      division: "manufacturing",
      images: [shutOffNozzleRender1, shutOffNozzleRender2],
      overview: "Rootier branded special shut-off nozzles. Available in spring-loaded, hydraulic, or pneumatic configurations to prevent polymer drooling, stringing, and leakage during injection cycles.",
      applications: [
        "Processing low-viscosity polymers (PA / Nylon, TPU, PET)",
        "Vertical injection moulding configurations where gravity leaks occur",
        "Co-injection and multi-color moulding operations"
      ],
      advantages: [
        "Eliminates polymer drool and nozzle blockage completely",
        "Ensures consistent shot weights and eliminates cosmetic parts defects",
        "Spring-loaded models require no external power connection"
      ],
      industries: ["Automotive", "Consumer Goods", "Precision Tooling"],
      specifications: {
        "Actuation Type": "Spring (pressure-actuated), Hydraulic, or Pneumatic",
        "Maximum Injection Pressure": "Up to 3000 Bar",
        "Heating Band Power": "Custom, band heater integration ready",
        "Material Class": "H13 Tool Steel, fully hardened"
      }
    },
    {
      id: "descaling-machine",
      name: "HF-2ZL Mould Cooling Channel Descaling Machine",
      division: "manufacturing",
      images: [mouldCleaningMachineFront, mouldCleaningMachineActive, mouldCleaningScreen],
      overview: "The HF-2ZL is a touchscreen-operated dynamic descaling machine that pumps specialized cleaning fluids through mould cooling lines. It dissolves and flushes out rust, calcium, and scale deposits.",
      applications: [
        "Periodic mould maintenance in production workshops",
        "Reconditioning blocked or low-flow mould channels",
        "Restoring heat-exchange performance to decrease cycle times"
      ],
      advantages: [
        "Restores design-level cooling capacity, reducing cycle times by 10-30%",
        "Automated reverse flow purging removes stubborn blockage debris",
        "Touchscreen interface displays real-time flow rate, pressure, and solution pH levels"
      ],
      industries: ["Injection Moulding", "Die Casting", "Tool Maintenance"],
      specifications: {
        "Model": "HF-2ZL",
        "Flow Rate": "Up to 60 L/min",
        "Tank Capacity": "30 Litres",
        "Display System": "4.3-inch HMI Touchscreen",
        "Weight": "45 kg"
      }
    },
    {
      id: "descaling-agent",
      name: "Eco-Safe Mould Descaling Agent",
      division: "manufacturing",
      images: [mouldCleaningBucket, mouldCleaningDebris, mouldCleaningDirtyWater, mouldCleaningCleanPipe],
      overview: "A specialized biological chemical descaling fluid designed for the HF-2ZL machine. It dissolves rust and calcium deposits within the mould cooling lines while remaining completely non-corrosive to steel, copper, and seal elements.",
      applications: [
        "Industrial scale removal from internal cooling channels",
        "Piping and heat-exchanger cleaning cycles",
        "Preventative maintenance to maintain flow rates"
      ],
      advantages: [
        "Highly effective scaling dissolving action",
        "Biodegradable: safe disposal post-neutralization",
        "Zero pitting or structural corrosion on tool-steel channels"
      ],
      industries: ["Mould Maintenance", "Industrial Cooling Systems"],
      specifications: {
        "pH Level": "Acidic concentrate (pH ~1.5)",
        "Dilution Ratio": "1:3 to 1:5 with water",
        "Compatibility": "Steel, Stainless Steel, Copper, Brass, NBR, Viton",
        "Eco Status": "Heavy-metal free, biodegradable"
      }
    },
    {
      id: "vertical-imm",
      name: "High-Precision Vertical Injection Moulding Machine",
      division: "manufacturing",
      images: [verticalImmRow, productionHallVerticalImms, wrappedVerticalImm],
      overview: "Represented via Ningbo Konger, these vertical clamping and vertical/horizontal injection moulding systems are optimized for insert and over-moulding. Features range from single-station, slide-table, to rotary table systems.",
      applications: [
        "Electronic connectors and sensor encapsulation",
        "Over-moulding metal inserts (screws, terminals, blades)",
        "Multi-material product combinations (plastic + metal + rubber)"
      ],
      advantages: [
        "Vertical clamp prevents gravity-induced insert misalignment during closure",
        "Rotary table models allow simultaneous loading and moulding to boost cycle speed",
        "Compact footprint saves factory floor space compared to horizontal machinery"
      ],
      industries: ["Electronics", "Automotive Electricals", "Medical Devices"],
      specifications: {
        "Clamping Force": "15 Ton to 350 Ton",
        "Table Options": "Fixed, Single Slide, Double Slide, 2-Station Rotary",
        "Control System": "Techmation / KEBA controller options",
        "Pump System": "Energy-efficient Servo Motor & Gear Pump"
      }
    },
    {
      id: "horizontal-imm",
      name: "Horizontal Injection Moulding Machines",
      division: "manufacturing",
      images: [immFactoryFloor],
      overview: "Horizontal injection moulding machines represented via Ningbo Konger. Includes standard toggle-clamp series, high-speed thin-wall packaging machinery, and specialized multi-color variants.",
      applications: [
        "High-volume consumer packaging (containers, lids)",
        "Automotive structural trims and housings",
        "Multi-color cosmetics packaging and toothbrush manufacturing"
      ],
      advantages: [
        "High-torque servo drives for reduced electrical power consumption",
        "Optimized clamping structures prevent platter deflection and reduce flash",
        "Vibrant multicolor and multi-material engineering variants"
      ],
      industries: ["Packaging", "Automotive", "Consumer Goods", "Housewares"],
      specifications: {
        "Clamping Force": "60 Ton to 2200 Ton",
        "Toggle Type": "5-point double toggle system",
        "Special Variants": "In-Mould Labeling (IML), Multicolor, PET Preform setup",
        "Standard": "High efficiency servo technology"
      }
    },
    {
      id: "injection-moulds",
      name: "Industrial Injection Moulds & Tooling",
      division: "manufacturing",
      images: [mouldPlateCores, briefIntroductionHall, antBrotherTeamGroup],
      overview: "Turnkey mould design, supply, and servicing in alliance with Ant Brother Precision Mould (China). Delivering precision moulds for automotive components, thin-wall food packaging, PET preforms, and large crates/furniture.",
      applications: [
        "Automotive door trims, grills, and structural brackets",
        "Thin-wall packaging container moulds (less than 0.4mm wall thickness)",
        "Large-format furniture, pallet, and industrial crate tooling"
      ],
      advantages: [
        "Advanced thermal cooling designs reduce cooling times by 15-20%",
        "Fully hot-runner integrated systems using premium gate valves",
        "Pre-shipment verification and trial validation reports provided"
      ],
      industries: ["Packaging", "Automotive", "Logistics & Warehousing"],
      specifications: {
        "Mould Weight": "Up to 25 Tons",
        "Cavity Steel": "S136, H13, 718H, P20 (fully hardened options)",
        "Hot Runner Brand": "Yudo or MOPU integration",
        "Design Standards": "HASCO / DME standards compliant"
      }
    },
    // Moulding Division Specific Tooling Verticals
    {
      id: "automotive-moulds",
      name: "Automotive Injection Moulds",
      division: "moulding",
      images: [wrappedVerticalImm],
      overview: "High-precision multi-cavity injection moulds engineered for automotive door trims, consoles, front grills, and structural body parts. Developed in partnership with Ant Brother Precision Mould.",
      applications: [
        "Automotive exterior trim parts",
        "Interior door panels and dashboard controls",
        "Under-hood structural components"
      ],
      advantages: [
        "Precision alignment grids minimize core displacement",
        "Excellent gate control ensures low cosmetic weld lines",
        "Optimized cooling lines to reduce stress warping"
      ],
      industries: ["Automotive"],
      specifications: {
        "Tool Category": "Class 101 Injection Mould",
        "Steel Type": "DIN 1.2738 / H13",
        "Typical Cavities": "1 to 4 Cavities",
        "Max Mold Size": "1600mm x 1200mm"
      }
    },
    {
      id: "furniture-moulds",
      name: "Large Furniture Moulds",
      division: "moulding",
      images: [factoryWorkersImm],
      overview: "Robust, high-tonnage tooling configurations designed for plastic chairs, cabinets, tables, and structural domestic furniture. Ensures uniform wall thickness and flash-free parting lines.",
      applications: [
        "Monobloc chairs and stools",
        "Modular plastic tables",
        "Large storage cabinets"
      ],
      advantages: [
        "Balanced material feeding gates eliminate flow marks",
        "Constructed with wear-resistant inserts to support continuous operations",
        "Optimized ejection systems reduce part deformation"
      ],
      industries: ["Consumer Goods", "Furniture"],
      specifications: {
        "Tool Category": "Medium to High Tonnage Mould",
        "Steel Type": "718H / P20",
        "Typical Cavities": "Single Cavity",
        "Clamping Force": "1000 to 2200 Ton IMM"
      }
    },
    {
      id: "crate-moulds",
      name: "Industrial Crate & Pallet Moulds",
      division: "moulding",
      images: [twoMenLobby],
      overview: "Heavy-duty moulds for high-impact industrial logistics crates, pallets, and stackable storage bins. Engineered with high-strength wear plates to withstand high-volume production cycles.",
      applications: [
        "Agriculture and fruit crates",
        "Milk and beverage storage containers",
        "Heavy industrial transport pallets"
      ],
      advantages: [
        "Deep cooling channels ensure rapid solidification of thick polymer ribs",
        "Specially treated tooling steel protects against recycled material wear",
        "Automatic core puller configurations for handles and clips"
      ],
      industries: ["Logistics", "Packaging", "Industrial Storage"],
      specifications: {
        "Tool Category": "High Impact Industrial Mould",
        "Steel Type": "1.2311 / 718",
        "Typical Cavities": "1 to 2 Cavities",
        "Core Pullers": "Hydraulic or mechanical options"
      }
    },
    {
      id: "thin-wall-moulds",
      name: "Thin-Wall Packaging Moulds",
      division: "moulding",
      images: [mouldPlateCores],
      overview: "Ultra-fast, high-precision tooling engineered for thin-wall food containers and lids with walls less than 0.4mm. Fully optimized thermal cooling layouts for cycle times under 4 seconds.",
      applications: [
        "Disposable food container packaging",
        "Yogurt and dairy cups",
        "Snap-on matching container lids"
      ],
      advantages: [
        "Independent cavity and core cooling lines reduce hot-spots",
        "Sub-micron tolerances prevent part flashing at high injection speeds",
        "Air-poppet ejection systems prevent vacuum part sticking"
      ],
      industries: ["Packaging", "Food & Beverage"],
      specifications: {
        "Tool Category": "High Speed Thin-Wall Mould",
        "Steel Type": "S136 Hardened HRC 48-52",
        "Typical Cavities": "4 to 32 Cavities",
        "Cycle Time": "Less than 4.5 seconds"
      }
    },
    {
      id: "packaging-moulds",
      name: "PET Preform & Packaging Moulds",
      division: "moulding",
      images: [assemblyFloorQmcBed],
      overview: "Precision PET preform and cosmetics container packaging moulds. Featuring advanced gate valve systems and balanced hot runner manifolds for uniform melt temperature distributions.",
      applications: [
        "Carbonated soft drink preforms",
        "Mineral water bottles",
        "High-aesthetic cosmetics containers"
      ],
      advantages: [
        "Valve-gate hot runners provide clean gating with zero sprue tails",
        "Easy replacement of individual cavity and core components",
        "Double-sliding safety locks prevent alignment wear"
      ],
      industries: ["Packaging", "Beverage", "Cosmetics"],
      specifications: {
        "Tool Category": "PET Hot Runner Preform Mould",
        "Steel Type": "S136 Corrosion-Resistant",
        "Typical Cavities": "8 to 72 Cavities",
        "Runner Class": "Valve Gated Hot Runner"
      }
    },
    {
      id: "custom-mould-design",
      name: "Custom Mould Design & Tooling",
      division: "moulding",
      images: [antBrotherTeamGroup],
      overview: "Turnkey tooling design consultancy including flow analysis, gate location auditing, cooling line balancing, and material shrinkage calibrations. Direct validation checks before shipment.",
      applications: [
        "Prototype tooling development",
        "Complex part modification consulting",
        "Mould flow and structural strength simulations"
      ],
      advantages: [
        "Reduces trial-and-error runs, ensuring right-first-time tooling layouts",
        "Improves gate balance to prevent dimensional warping",
        "Comprehensive DFM reports provided before steel cut"
      ],
      industries: ["Engineering", "Product Design"],
      specifications: {
        "Design Standards": "HASCO / DME / JIS",
        "Softwares": "UG NX / Moldflow / AutoCAD",
        "DFM Deliverables": "3D CAD files, Moldflow reports, inspection sheets"
      }
    }
  ] as Product[],

  partners: [
    {
      id: "kunshan-shangzhiyou",
      name: "Kunshan Shangzhiyou Precision Machinery Co., Ltd.",
      logo: szyLogo,
      country: "China",
      overview: "Established manufacturer specializing in Quick Mould Change systems, including hydraulic power units, clamping plates, and mold transport tooling. Known for safety interlock systems.",
      technologies: ["Hydraulic Clamping Plates", "Magnetic Clamping Systems", "Die Change Arms & Lifts"],
      categories: ["Mould Accessories", "Die Clamping"],
      engineeringCapabilities: ["Heavy-duty hydraulic system design", "IMM safety controller integrations", "Custom mechanical mold lift engineering"],
      certificatePath: shangzhiyouAuth,
      website: "#"
    },
    {
      id: "ningbo-konger",
      name: "Ningbo Konger Imp & Export Co., Ltd.",
      country: "China",
      overview: "Global exporter and manufacturing base for premium vertical and horizontal injection moulding machines. Famous for specialized high-speed and multicolor variants.",
      technologies: ["Servo Horizontal IMM", "Multi-material Injection", "Vertical insert molding machinery"],
      categories: ["Injection Moulding Machines", "Automation Systems"],
      engineeringCapabilities: ["Variable-tonnage toggle design", "Multicolor co-injection engineering", "Turnkey robotic cell layout automation"],
      certificatePath: kongerAuth,
      website: "#"
    },
    {
      id: "mopu-machinery",
      name: "MOPU Machinery Technology (Suzhou) Co., Ltd. (Meici Tech)",
      country: "China",
      overview: "High-tech manufacturing enterprise focused on hot runner systems, temperature controller manifolds, and cold runner components for complex multi-cavity injection moulds.",
      technologies: ["Valve Gate Hot Runners", "Manifold Thermal Layouts", "Smart Temperature Control units"],
      categories: ["Hot Runners", "Injection Accessories"],
      engineeringCapabilities: ["Mold flow thermal balancing analysis", "Custom manifold routing", "Multi-zone temperature controller assembly"],
      certificatePath: mopuAuth,
      website: "#"
    },
    {
      id: "ant-brother",
      name: "Ant Brother Precision Mould (Suzhou) Co., Ltd.",
      country: "China",
      overview: "Elite toolmaker specializing in complex injection moulds for automotive, logistics packaging, and thin-wall consumer containers. Equipped with CNC machinery.",
      technologies: ["Thin-Wall High Speed Moulds", "Crate & Furniture Tooling", "Precision Die Making"],
      categories: ["Injection Moulds", "Tooling"],
      engineeringCapabilities: ["High-speed CNC milling", "Automated EDM erosion matching", "Mould testing trial validations"],
      certificatePath: antBrotherAuth,
      website: "#"
    },
    {
      id: "shine-star",
      name: "Shine Star Machinery Co., Ltd.",
      country: "China",
      overview: "Strategic partner in automation auxiliary systems, handling raw materials hopper systems, conveyor automation, and robot take-out systems.",
      technologies: ["Conveyor Systems", "Material Drying & Feeding", "Robotic Take-Outs"],
      categories: ["Automation Systems", "Peripherals"],
      engineeringCapabilities: ["Central feeding system design", "Pneumatic material convey layout", "Robotic arm cycle synchronization"],
      website: "#"
    }
  ] as Partner[],

  services: [
    {
      id: "erp-consulting",
      title: "ERP Consulting & Integration",
      category: "IT/ITES",
      description: "Providing industrial enterprises with ERP advisory services to digitize operational processes from procurement to factory execution.",
      details: [
        "Mapping manufacturing assembly steps to ERP modules",
        "Business process re-engineering for industrial cost control",
        "Integration of warehouse tracking systems with central accounting"
      ],
      icon: "database"
    },
    {
      id: "sap-migration",
      title: "SAP S/4HANA Migration",
      category: "IT/ITES",
      description: "Assisting manufacturing entities in moving legacy SAP configurations to high-performance SAP S/4HANA cloud architectures.",
      details: [
        "Data cleaning and target database schema layout",
        "Custom code optimization and validation checks",
        "User training and zero-downtime cutover deployment"
      ],
      icon: "server"
    },
    {
      id: "supplier-integration",
      title: "Peripheral Supplier Integration",
      category: "IT/ITES",
      description: "Implementing custom API architectures to link shop-floor moulding machines with material supply chains and shipping portals.",
      details: [
        "Development of real-time material level tracking webhooks",
        "Automated purchasing orders triggered by machine consumption data",
        "Supplier portal implementation for real-time order state updates"
      ],
      icon: "link"
    },
    {
      id: "engineering-consultancy",
      title: "Engineering Consultancy Services",
      category: "Consultancy",
      description: "Process auditing and engineering consulting to optimize injection moulding performance, tooling selection, and material configurations.",
      details: [
        "Mould flow analysis review and gate location audit",
        "Material compatibility check and shrinkage forecasting",
        "Energy efficiency audits for hydraulic machinery"
      ],
      icon: "tool"
    },
    {
      id: "qms-implementation",
      title: "Quality Management Systems (QMS)",
      category: "Consultancy",
      description: "Advising and preparing industrial shops for standard ISO 9001 certifications, auditing existing workflows, and building standard operating document libraries.",
      details: [
        "Formulating standard operating procedures (SOP) for mold setup",
        "Designing quality inspection gate workflows and scrap logs",
        "Pre-audit evaluations and correction implementations"
      ],
      icon: "award"
    },
    {
      id: "enviro-audit",
      title: "Environmental Auditing & Compliance",
      category: "Consultancy",
      description: "Helping plastic processors align with municipal recycling rules, optimize water usage, and complete environmental audits.",
      details: [
        "Mould cooling water recycling audits and loop design",
        "Scrap plastic pellet capture and regrind usage plans",
        "Carbon footprint calculations for heavy hydraulic machinery"
      ],
      icon: "globe"
    }
  ] as ServiceItem[],

  gallery: [
    { id: "g1", src: anhuiReception, category: "facilities", alt: "Anhui technology facility lobby visit", caption: "Allied delegation visiting Anhui technology facilities during strategic partner reviews." },
    { id: "g2", src: mouldPlateCores, category: "production", alt: "Mould plate cores detail view", caption: "Precision inspection of high-cavity circular cores on an injection mould." },
    { id: "g3", src: immFactoryFloor, category: "machines", alt: "Large horizontal injection moulding machine", caption: "On-site commissioning of a high-tonnage horizontal toggle injection moulding machine." },
    { id: "g4", src: officeMeeting1, category: "visits", alt: "Technical partner office board meeting", caption: "Allied directors discussing hot-runner integration plans with Chinese principals." },
    { id: "g5", src: assemblyFloorQmcBed, category: "production", alt: "Large QMC magnetic clamping bed assembly", caption: "Structural validation of a large quick mold change magnetic clamping platen." },
    { id: "g6", src: factoryBuildingExterior1, category: "facilities", alt: "Principal factory building exterior view", caption: "Exterior view of Ningbo Konger's high-tech manufacturing headquarters." },
    { id: "g7", src: factoryBuildingExterior2, category: "facilities", alt: "Partner assembly plant exterior view", caption: "Machinery assembly plant facade of partner facilities in Kunshan." },
    { id: "g8", src: briefIntroductionHall, category: "visits", alt: "Brief introduction board review", caption: "Allied managing partner reviewing partner introduction walls during facility tours." },
    { id: "g9", src: verticalImmRow, category: "machines", alt: "Row of vertical IMM machines on assembly line", caption: "Assembly line of high-precision vertical injection moulding machines." },
    { id: "g10", src: productionHallVerticalImms, category: "production", alt: "Vertical IMM production hall view", caption: "Inside the active testing floor of a partner's vertical IMM assembly hall." },
    { id: "g11", src: wrappedVerticalImm, category: "machines", alt: "Wrapped vertical IMM machine ready for shipment", caption: "A dual-station vertical IMM wrapped in protective plastic, ready for shipment to Chennai." },
    { id: "g12", src: officeMeeting2, category: "visits", alt: "Boardroom agreement negotiations", caption: "Detailed boardroom negotiations securing exclusive distribution letters." },
    { id: "g13", src: antBrotherTeamGroup, category: "visits", alt: "Ant Brother team group photo", caption: "Group photo of Allied directors and the Ant Brother engineering team." },
    { id: "g14", src: threeMenGroup, category: "visits", alt: "Partner engineers group photo", caption: "Directors with the chief technical officer of MOPU Hot Runner Systems." },
    { id: "g15", src: lobbyTeamGroup, category: "visits", alt: "Allied directors group photo inside partner lobby", caption: "Strategic partnership renewal ceremony at the Kunshan Shangzhiyou lobby." },
    { id: "g16", src: factoryWorkersImm, category: "production", alt: "Factory floor commissioning team photo", caption: "Chennai service engineers with the commissioning team in front of a green IMM." },
    { id: "g17", src: twoMenLobby, category: "visits", alt: "Two directors group photo in lobby", caption: "Managing partner with the general manager of MCB Moulds." }
  ] as GalleryItem[]
};
