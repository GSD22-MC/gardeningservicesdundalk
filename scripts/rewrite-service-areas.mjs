/**
 * Rewrite Service-Area Pages
 * Generates unique, high-quality content for each service+area combination
 * Replaces the spammy duplicate WordPress content
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(import.meta.dirname, '..', 'src', 'content', 'service-areas');

// ── Area Data ──────────────────────────────────────────────────────────────────
const areas = [
  { slug: 'annagassan', name: 'Annagassan', desc: 'a quiet coastal village along Dundalk Bay', distance: '15km south of Dundalk', nearby: 'Castlebellingham and Dunleer', character: 'coastal', terrain: 'flat, coastal land with sea breeze exposure', soilNote: 'sandy, well-drained soil common near the coast' },
  { slug: 'ardee', name: 'Ardee', desc: 'one of the oldest towns in Ireland with a rich heritage', distance: '25km southwest of Dundalk', nearby: 'Collon and Tallanstown', character: 'town', terrain: 'rolling midlands with fertile farmland', soilNote: 'rich, loamy soil typical of the midlands' },
  { slug: 'ballymascanlan', name: 'Ballymascanlan', desc: 'a scenic area nestled at the foot of the Cooley Mountains', distance: 'just 5km north of Dundalk', nearby: 'Ravensdale and Dundalk town', character: 'mountain', terrain: 'sloping ground near the Cooley foothills', soilNote: 'heavy clay soils common in the foothills' },
  { slug: 'blackrock', name: 'Blackrock', desc: 'a popular seaside village south of Dundalk', distance: '5km south of Dundalk', nearby: 'Dundalk and Haggardstown', character: 'coastal', terrain: 'flat coastal land with exposed gardens', soilNote: 'light, sandy soil that drains quickly' },
  { slug: 'carlingford', name: 'Carlingford', desc: 'a picturesque medieval village on the shores of Carlingford Lough', distance: '20km northeast of Dundalk', nearby: 'Omeath and Greenore', character: 'coastal', terrain: 'steep, rocky terrain with mountain views', soilNote: 'thin, rocky soil on sloped sites' },
  { slug: 'castlebellingham', name: 'Castlebellingham', desc: 'a charming village on the main Dublin-Belfast road', distance: '12km south of Dundalk', nearby: 'Annagassan and Dunleer', character: 'village', terrain: 'low-lying ground near the River Glyde', soilNote: 'moist, fertile soil near the river' },
  { slug: 'greenore', name: 'Greenore', desc: 'a small coastal community on the Cooley Peninsula', distance: '18km east of Dundalk', nearby: 'Carlingford and Dundalk', character: 'coastal', terrain: 'exposed coastal land with strong winds', soilNote: 'light, free-draining coastal soil' },
  { slug: 'hackballscross', name: 'Hackballscross', desc: 'a rural border village near the Armagh boundary', distance: '15km northwest of Dundalk', nearby: 'Forkhill and Dromintee', character: 'rural', terrain: 'elevated rural ground with mixed conditions', soilNote: 'heavy, moisture-retentive soil' },
  { slug: 'inniskeen', name: 'Inniskeen', desc: 'a rural village famous as the birthplace of poet Patrick Kavanagh', distance: '20km west of Dundalk', nearby: 'Carrickmacross and Dundalk', character: 'rural', terrain: 'drumlin country with rolling hills', soilNote: 'clay-heavy, slow-draining soil on drumlin terrain' },
  { slug: 'jenkinstown', name: 'Jenkinstown', desc: 'a rural area near Jenkinstown Park and the Cooley Mountains', distance: '10km northwest of Dundalk', nearby: 'Dundalk and the Cooley Peninsula', character: 'rural', terrain: 'undulating farmland with sheltered gardens', soilNote: 'moderately heavy loam' },
  { slug: 'knockbridge', name: 'Knockbridge', desc: 'a small rural village associated with the legend of Cu Chulainn', distance: '10km west of Dundalk', nearby: 'Louth Village and Dundalk', character: 'rural', terrain: 'flat to gently rolling farmland', soilNote: 'rich, deep loam ideal for lawns' },
  { slug: 'lordship', name: 'Lordship', desc: 'a rural area on the southern slopes of the Cooley Mountains', distance: '8km north of Dundalk', nearby: 'Carlingford and Ballymascanlan', character: 'mountain', terrain: 'sloped ground with mountain shelter', soilNote: 'acidic clay soil typical of mountain foothills' },
  { slug: 'louth-village', name: 'Louth Village', desc: 'a historic village that gave County Louth its name', distance: '10km southwest of Dundalk', nearby: 'Knockbridge and Ardee', character: 'village', terrain: 'open farmland with large garden plots', soilNote: 'well-structured clay-loam soil' },
  { slug: 'omeath', name: 'Omeath', desc: 'a seaside village on Carlingford Lough with views across to the Mourne Mountains', distance: '15km northeast of Dundalk', nearby: 'Carlingford and Warrenpoint', character: 'coastal', terrain: 'steep, sheltered ground along the lough', soilNote: 'thin, acidic soil on steep ground' },
];

// Some services use 'louth' instead of 'louth-village'
const louthSlugOverrides = {
  'grass-cutting-lawn-care': 'louth',
  'fencing-installation': 'louth',
};

// ── Service Definitions ────────────────────────────────────────────────────────

function grassCutting(area) {
  return {
    slug: `grass-cutting-lawn-care-${louthSlugOverrides['grass-cutting-lawn-care'] && area.slug === 'louth-village' ? 'louth' : area.slug}`,
    title: `Grass Cutting & Lawn Mowing ${area.name}`,
    seoTitle: `Grass Cutting ${area.name} | Lawn Mowing from €25 | Free Quotes`,
    seoDescription: `Professional grass cutting and lawn mowing in ${area.name}, Co. Louth. Weekly, fortnightly or one-off cuts. Fully insured. Call Pete & Seamus for a free quote.`,
    content: `
Looking for reliable grass cutting in ${area.name}? Pete & Seamus provide professional lawn mowing services across ${area.name} and the surrounding areas of ${area.nearby}. With over 35 years of combined experience, we keep lawns in ${area.desc} looking their best all year round.

## Our Grass Cutting Service in ${area.name}

We offer flexible lawn care packages to suit every garden in ${area.name}:

- **Weekly or fortnightly mowing** — regular maintenance to keep your lawn neat
- **One-off cuts** — ideal for overgrown gardens or before events
- **Edge trimming and strimming** — clean lines along paths, walls and flower beds
- **Grass clipping collection** — we leave your lawn tidy, not covered in cuttings
- **Seasonal lawn treatments** — feeding, weed control and moss treatment

## Why ${area.name} Lawns Need Regular Care

Gardens in ${area.name} sit on ${area.terrain}. The ${area.soilNote} means grass grows well here, but without regular cutting it quickly becomes unmanageable. During the Irish growing season (March to October), lawns in this area typically need cutting every 7 to 14 days.

We adjust our cutting height and frequency based on the time of year. In spring, we cut higher to encourage strong root growth. In summer, we maintain a medium height for a healthy, lush finish.

## What We Bring

We arrive with professional-grade equipment — no domestic lawn mowers here. Our kit includes:

- Commercial cylinder and rotary mowers for different lawn types
- Petrol strimmers for edges, around trees and along walls
- Leaf blowers for a clean finish after every visit
- All fuel, tools and materials included in the price

## Pricing for Grass Cutting in ${area.name}

Our prices are based on lawn size and access. As a guide:

| Lawn Size | Price Per Cut |
|-----------|--------------|
| Small (up to 50m²) | From €25 |
| Medium (50–150m²) | From €35 |
| Large (150m²+) | From €50 |

We offer discounts for regular customers on fortnightly or weekly schedules. Every quote is free and there's no obligation.

## Frequently Asked Questions

### How often should I get my grass cut in ${area.name}?
During the growing season (April to September), we recommend cutting every 7 to 10 days. In early spring and autumn, fortnightly is usually enough. We can set up a regular schedule that works for you.

### Do you cut wet grass?
We avoid cutting in heavy rain as it damages the lawn and clogs equipment. If conditions are poor on your scheduled day, we'll rearrange for the next dry day at no extra charge.

### Can you handle overgrown gardens?
Absolutely. We regularly clear overgrown lawns in ${area.name} and the surrounding areas. We'll cut it back in stages to avoid shocking the grass, then get it on a regular schedule.

### Do you serve all of ${area.name}?
Yes — we cover all of ${area.name} and surrounding areas including ${area.nearby}. We're based ${area.distance}, so we're always nearby.

## Book Your Grass Cutting in ${area.name}

Call us today on **085 168 5170** for a free, no-obligation quote. We can usually start within a few days. You can also reach us on WhatsApp or through our [contact page](/contact/).
`
  };
}

function gardenMaintenance(area) {
  return {
    slug: `garden-maintenance-${area.slug}`,
    title: `Garden Maintenance ${area.name}`,
    seoTitle: `Garden Maintenance ${area.name} | Weekly & One-Off | Free Quotes`,
    seoDescription: `Complete garden maintenance in ${area.name}, Co. Louth. Weeding, pruning, planting, lawn care and seasonal clean-ups. Pete & Seamus — 35+ years experience.`,
    content: `
Need a hand keeping your garden in shape? Pete & Seamus offer complete garden maintenance services in ${area.name} and surrounding areas. Whether you need regular upkeep or a one-off tidy-up, we handle everything so you can enjoy your outdoor space without the hard work.

## Garden Maintenance Services in ${area.name}

We provide a full range of garden care for homes and businesses in ${area.name}:

- **Regular garden upkeep** — weekly, fortnightly or monthly visits
- **Weeding and border maintenance** — keeping beds tidy and weed-free
- **Pruning and deadheading** — roses, shrubs, perennials and climbers
- **Seasonal planting** — bedding plants, bulbs and container displays
- **Lawn care** — mowing, edging, feeding and moss treatment
- **Garden clean-ups** — spring and autumn clear-outs, leaf removal
- **Pressure washing** — patios, paths, driveways and decking

## Tailored to ${area.name} Gardens

Gardens in ${area.name}, ${area.desc}, have their own character. The local ${area.soilNote} and ${area.terrain} create specific growing conditions that we understand well after years of working in the area.

We plan our maintenance visits around the seasons. In spring, we focus on preparation — clearing winter debris, pruning back, and getting beds ready for planting. Summer visits centre on mowing, weeding, and deadheading to keep everything looking fresh. Autumn means leaf clearance, cutting back perennials, and protecting tender plants. In winter, we handle structural pruning and tidying.

## How Our Regular Maintenance Works

1. **Free consultation** — we visit your garden in ${area.name}, discuss what you need, and agree a plan
2. **Scheduled visits** — we come on the same day each week or fortnight, so you always know when to expect us
3. **Full service** — each visit covers mowing, edging, weeding and any seasonal tasks due
4. **Clean finish** — we take all green waste away and leave your garden tidy

## Who We Work With

Our garden maintenance customers in ${area.name} include:

- **Homeowners** looking for regular help with their garden
- **Landlords and letting agents** who need rental properties maintained
- **Holiday homes** along the ${area.character === 'coastal' ? 'coast' : 'area'} that need year-round care
- **Elderly residents** who can no longer manage heavy garden work
- **Businesses** wanting tidy, welcoming grounds

## Frequently Asked Questions

### How much does garden maintenance cost in ${area.name}?
Regular maintenance starts from €40 per visit for a small garden, depending on the work required. We offer competitive monthly packages for regular customers. Call us for a free quote specific to your garden.

### Can you do a one-off garden clean-up?
Yes, we regularly do one-off garden clearances and tidy-ups in ${area.name}. This is popular in spring or before selling a property. We'll clear overgrown areas, weed beds, prune shrubs and leave everything looking great.

### Do you remove green waste?
We take all green waste away as part of our service. It's disposed of responsibly — we compost where possible and use licensed waste facilities for larger volumes.

### How far in advance do I need to book?
We can usually fit in new regular customers within a week or two. For one-off jobs, we aim to schedule within a few days. During busy periods (spring and autumn), booking a week ahead is recommended.

## Get Started

Call Pete & Seamus on **085 168 5170** for a free garden assessment in ${area.name}. We'll visit your garden, discuss your needs, and give you an honest quote with no obligation.
`
  };
}

function gardenLandscaping(area) {
  return {
    slug: `garden-landscaping-${area.slug}`,
    title: `Garden Landscaping ${area.name}`,
    seoTitle: `Garden Landscaping ${area.name} | Design & Build | Free Quotes`,
    seoDescription: `Professional garden landscaping in ${area.name}, Co. Louth. Full design and build service — patios, planting, lawns, retaining walls and more. Free quotes.`,
    content: `
Planning a garden transformation in ${area.name}? Pete & Seamus design and build beautiful, practical outdoor spaces across ${area.name} and the wider County Louth area. From complete garden redesigns to specific landscaping projects, we bring over 35 years of hands-on experience to every job.

## Landscaping Services in ${area.name}

We offer a complete landscaping service from initial design through to finished garden:

- **Full garden design and build** — new layouts from scratch
- **Patio and paving installation** — natural stone, concrete, porcelain
- **Retaining walls and raised beds** — stone, block, sleeper and gabion
- **Lawn installation** — turf laying and seeding
- **Planting schemes** — trees, shrubs, hedging and perennial borders
- **Drainage solutions** — French drains, soakaways and grading
- **Garden lighting** — path lights, feature lighting and power points
- **Steps, paths and edging** — connecting your garden spaces

## Landscaping for ${area.name} Conditions

${area.name} is ${area.desc}, and gardens here sit on ${area.terrain}. We take local conditions into account on every project:

${area.character === 'coastal' ? `**Coastal considerations:** Gardens near the coast face salt spray, strong winds and sandy soil. We select wind-tolerant plants, use sturdy materials that resist salt corrosion, and design sheltered seating areas where you can enjoy the outdoors even on breezy days.` : area.character === 'mountain' ? `**Hillside considerations:** The sloped terrain around ${area.name} means drainage, soil stability and access all need careful planning. We build solid retaining walls, create level terraces for seating and planting, and ensure proper drainage to prevent waterlogging on heavy clay.` : `**Local considerations:** The ${area.soilNote} in ${area.name} gives us a good foundation to work with. We improve soil structure where needed, select plants suited to local conditions, and design gardens that look great year-round in the Irish climate.`}

## Our Landscaping Process

1. **Site visit and consultation** — we visit your property in ${area.name}, take measurements, discuss your ideas and budget
2. **Design proposal** — we present a clear plan with materials, planting and costs
3. **Groundwork** — clearance, excavation, drainage and base preparation
4. **Hard landscaping** — patios, walls, paths, steps and structures
5. **Soft landscaping** — soil preparation, planting, turfing and finishing
6. **Handover** — we walk you through your new garden and provide aftercare advice

## Recent Work Near ${area.name}

We've completed landscaping projects throughout ${area.name} and the surrounding areas of ${area.nearby}. Our work ranges from small courtyard gardens to large residential landscapes. We're happy to show you examples of similar projects during your consultation.

## Frequently Asked Questions

### How much does garden landscaping cost in ${area.name}?
Every garden is different. A small patio project might start from €2,000, while a full garden redesign typically ranges from €5,000 to €15,000+. We provide detailed written quotes so you know exactly what you're paying for before any work begins.

### How long does a landscaping project take?
A typical garden landscaping project takes 1 to 3 weeks depending on size and complexity. Larger projects with extensive hard landscaping may take longer. We'll give you a realistic timeline during the quotation stage.

### Do I need planning permission for landscaping in ${area.name}?
Most residential landscaping work is exempt from planning permission. However, significant changes to levels, boundary walls over 2 metres, or structures may require planning. We'll advise you on this during the consultation.

### What time of year is best for landscaping?
We landscape year-round, though spring and autumn are ideal for planting. Hard landscaping (patios, walls, paths) can be done any time the weather allows. The earlier you book, the sooner we can schedule your project.

## Get a Free Quote

Call **085 168 5170** to arrange a free site visit in ${area.name}. We'll discuss your ideas, assess the site, and provide an honest, detailed quote.
`
  };
}

function deckingServices(area) {
  return {
    slug: `decking-services-${area.slug}`,
    title: `Decking Services ${area.name}`,
    seoTitle: `Decking Installation ${area.name} | Timber & Composite | Free Quotes`,
    seoDescription: `Professional decking installation in ${area.name}, Co. Louth. Timber and composite decking, repairs, cleaning and staining. Free quotes from Pete & Seamus.`,
    content: `
Want to add a deck to your garden in ${area.name}? Pete & Seamus build quality timber and composite decking for homes across ${area.name} and County Louth. Whether you need a simple raised platform or a multi-level deck with steps and balustrades, we handle the full job from design to completion.

## Decking Services We Offer in ${area.name}

- **New decking installation** — timber and composite options
- **Raised and ground-level decks** — designed to suit your garden's layout
- **Decking with steps and handrails** — safe access on sloped sites
- **Built-in seating and planters** — maximising your outdoor living space
- **Decking repairs** — replacing damaged boards, fixing structural issues
- **Decking cleaning and staining** — restoring weathered timber decks
- **Balustrades and privacy screens** — glass, metal or timber

## Timber vs Composite Decking

We install both timber and composite decking in ${area.name}. Here's how they compare:

| Feature | Timber Decking | Composite Decking |
|---------|---------------|-------------------|
| Cost | Lower upfront | Higher upfront |
| Maintenance | Needs annual treatment | Very low maintenance |
| Lifespan | 10–15 years with care | 25+ years |
| Appearance | Natural wood grain | Wood-effect finish |
| Slip resistance | Moderate (improves with treatment) | Good (textured surface) |

${area.character === 'coastal' ? `For gardens in ${area.name} near the coast, we often recommend composite decking. It handles salt air and moisture better than untreated timber and won't warp or split over time.` : area.character === 'mountain' ? `In ${area.name}, where rainfall and humidity are higher on the mountain slopes, composite decking is a practical choice. However, quality pressure-treated timber works well too with proper drainage underneath.` : `For ${area.name} gardens, both options work well. We'll help you choose based on your budget, how much maintenance you want to do, and the look you're after.`}

## Why Proper Installation Matters

A deck is only as good as its substructure. We build every deck on a solid framework of treated joists, properly spaced and ventilated. Key steps we follow:

1. **Ground preparation** — clearing, levelling and laying a weed membrane
2. **Support structure** — concrete pads or screw piles with treated timber frame
3. **Ventilation** — minimum 150mm clearance for airflow beneath the deck
4. **Board fixing** — correct spacing for expansion, hidden fixings where possible
5. **Finishing** — sanding edges, applying treatment (timber), adding trims

## Decking Prices in ${area.name}

Decking costs depend on size, material choice and site conditions. As a rough guide:

- **Timber decking:** from €65 per m² (supply and fit)
- **Composite decking:** from €120 per m² (supply and fit)
- **Decking cleaning and re-staining:** from €15 per m²

We provide free, detailed quotes — no surprises, no hidden costs.

## Frequently Asked Questions

### Does decking need planning permission in ${area.name}?
Most garden decking is exempt from planning permission if it's under 1 metre in height and within your rear garden. Decking attached to a listed building or in a conservation area may need approval. We'll advise you during the consultation.

### How long does decking installation take?
A standard deck (15–25m²) typically takes 2 to 4 days to complete. Larger or more complex projects with steps, levels or built-in features may take up to a week.

### Can you build decking on a slope in ${area.name}?
Yes — we regularly build raised and stepped decking on sloped sites around ${area.name}. ${area.character === 'mountain' || area.character === 'coastal' ? `The varied terrain here means we often work with slopes, and we design the substructure to create a level platform regardless of the ground beneath.` : `We design the substructure to create a perfectly level surface even on uneven ground.`}

### Do you clean and restore existing decking?
Absolutely. We offer pressure washing, sanding and re-staining for tired timber decking. It's a cost-effective way to refresh your outdoor space without a full replacement.

## Book a Free Consultation

Ring Pete & Seamus on **085 168 5170** for a free site visit and quote in ${area.name}. We'll measure up, discuss your options, and give you an honest price.
`
  };
}

function fencingInstallation(area) {
  const areaSlug = area.slug === 'louth-village' ? 'louth' : area.slug;
  return {
    slug: `fencing-installation-${areaSlug}`,
    title: `Fencing Installation ${area.name}`,
    seoTitle: `Fencing ${area.name} | PVC, Timber & Panel Fencing | Free Quotes`,
    seoDescription: `Professional fencing installation in ${area.name}, Co. Louth. PVC, timber panel, post and rail fencing. Repairs and replacements. Free quotes — call today.`,
    content: `
Need new fencing in ${area.name}? Pete & Seamus install all types of garden and boundary fencing across ${area.name} and County Louth. From a single panel replacement to a complete perimeter fence, we supply quality materials and install them properly so they last.

## Fencing Options for ${area.name}

We install a wide range of fencing styles to suit every property and budget:

### PVC / uPVC Fencing
Maintenance-free and long-lasting. PVC fencing won't rot, warp or need painting. Available in white, grey and woodgrain finishes. A popular choice in ${area.name} for front and rear gardens.

### Timber Panel Fencing
The classic garden fence. We use pressure-treated timber panels fitted to sturdy concrete or timber posts. Available in closeboard, lap panel and hit-and-miss styles for different levels of privacy.

### Post and Rail Fencing
A traditional countryside style, ideal for larger properties around ${area.name}. Available in timber or metal. Often used for boundary definition rather than privacy.

### Concrete Post and Panel
Extremely durable and low maintenance. Concrete gravel boards at the base prevent rot, while concrete posts mean no future post replacements. ${area.character === 'coastal' ? `A smart choice for ${area.name} where coastal winds can test weaker fencing.` : `Built to last in all weather conditions.`}

### Composite Fencing
A modern option that combines the look of timber with the durability of composite materials. No painting, no rotting, and available in a range of colours.

## Fencing Prices in ${area.name}

Fencing costs depend on the length, material and terrain. Here's a rough guide:

| Fencing Type | Price Per Metre (supply & fit) |
|-------------|-------------------------------|
| Timber panel (6ft) | From €40 |
| PVC fencing | From €55 |
| Concrete post & panel | From €50 |
| Post and rail | From €30 |
| Composite fencing | From €70 |

These prices include posts, panels, gravel boards (where applicable) and installation. We remove old fencing and dispose of it for a small additional charge.

## Common Fencing Jobs in ${area.name}

- **Full garden re-fencing** — removing old fencing and installing new
- **Storm damage repairs** — replacing blown panels and broken posts
- **Boundary fencing** — new fences between properties
- **Security fencing** — taller, sturdier fencing for added privacy
- **Gates** — matching timber, PVC or metal gates to complete the boundary
- **Trellis and screening** — extending fence height or adding garden features

## ${area.name} Fencing Considerations

${area.character === 'coastal' ? `Coastal winds in ${area.name} put extra stress on fencing. We use deeper post holes (minimum 600mm), concrete post bases, and recommend solid panel or concrete fencing that handles exposure. Timber fencing near the coast needs regular treatment to prevent salt damage.` : area.character === 'mountain' ? `The exposed, sloped terrain around ${area.name} requires fencing that can handle wind and uneven ground. We step panels up slopes rather than raking them, use deeper post foundations, and recommend concrete posts for longevity on the hillside.` : `In ${area.name}, the main considerations are soil type, boundary lines and privacy requirements. The ${area.soilNote} provides good post foundations in most locations. We always check with neighbours and boundary lines before starting work.`}

## Frequently Asked Questions

### What is the legal fence height in ${area.name}?
Garden fences up to 2 metres (6.5 feet) in your rear garden typically don't need planning permission. Front garden fences are limited to 1.2 metres. Always check with the local authority if you're unsure.

### How long does fencing take to install?
A typical garden (30–40 metres of fencing) takes 1 to 2 days. We can usually start within a week of your quote being approved.

### Do you take down old fencing?
Yes — we remove and dispose of old fencing as part of the job. We can also work with existing posts if they're still sound, which reduces cost.

### Can you install fencing on uneven ground?
Absolutely. We regularly install fencing on sloped and uneven sites in ${area.name} and the surrounding areas. We step the panels to follow the contour of the ground.

## Get a Free Fencing Quote

Call Pete & Seamus on **085 168 5170** for a free quote on fencing in ${area.name}. We'll visit, measure up and give you a written quote with no obligation.
`
  };
}

function hedgeTrimming(area) {
  return {
    slug: `hedge-trimming-services-${area.slug}`,
    title: `Hedge Trimming Services ${area.name}`,
    seoTitle: `Hedge Trimming ${area.name} | Cutting & Removal | Free Quotes`,
    seoDescription: `Professional hedge trimming and cutting in ${area.name}, Co. Louth. All hedge types — privet, laurel, leylandii, beech and more. Fully insured. Free quotes.`,
    content: `
Hedges looking overgrown in ${area.name}? Pete & Seamus provide professional hedge trimming, shaping and reduction services across ${area.name} and County Louth. We handle hedges of all sizes — from a tidy garden privet to a 20-foot leylandii boundary.

## Hedge Services in ${area.name}

- **Regular hedge trimming** — keeping hedges neat and uniform
- **Hedge reduction** — lowering height and reducing width on overgrown hedges
- **Hedge shaping** — formal shapes, arched tops, rounded profiles
- **New hedge planting** — native, evergreen and mixed hedging
- **Hedge removal** — complete removal including stump grinding
- **One-off tidying** — getting neglected hedges back into shape

## Common Hedge Types in ${area.name}

We work with every hedge variety found in gardens across ${area.name}:

| Hedge Type | Best Time to Trim | Growth Rate |
|-----------|-------------------|-------------|
| Privet | May–Sep (2–3 times) | Fast |
| Laurel | June and September | Moderate |
| Leylandii | April–August | Very fast |
| Beech | August (once) | Moderate |
| Griselinia | May–September | Moderate |
| Escallonia | After flowering | Moderate |
| Native mixed | Feb (once) or Aug | Varies |

${area.character === 'coastal' ? `Gardens in ${area.name} often use griselinia and escallonia hedging, which thrive in the coastal conditions. These species handle salt spray well and provide good shelter from sea winds.` : area.character === 'mountain' ? `In ${area.name} and the Cooley foothills, native hedgerows with hawthorn, blackthorn and hazel are common along boundaries. These need careful management, typically in late winter, to maintain their health and wildlife value.` : `In ${area.name}, privet and laurel are the most common garden hedges, while native hedgerows with hawthorn and blackthorn are found along rural boundaries. Each type has its own trimming schedule and technique.`}

## When to Trim Hedges in Ireland

Timing matters both for the health of your hedge and for wildlife:

- **March to August:** Nesting season — we check for nesting birds before cutting (it's illegal to destroy nests under the Wildlife Act)
- **Late summer (August–September):** Ideal time for a clean trim on most hedges
- **Late winter (January–February):** Best for hard pruning and renovation of deciduous hedges
- **Year-round:** Light tidying and shaping is fine any time

We always check for nesting birds before starting work.

## Hedge Trimming Prices in ${area.name}

Pricing depends on the length, height and condition of your hedges:

| Hedge Size | Typical Price |
|-----------|--------------|
| Small (under 2m high, under 10m long) | From €60 |
| Medium (2–3m high, 10–20m long) | From €120 |
| Large (3m+ high or 20m+ long) | From €200 |
| Hedge reduction (major cut-back) | Quoted on site |

All prices include cutting, shaping and removal of all cuttings. We leave your garden tidy.

## Frequently Asked Questions

### How often should hedges be trimmed in ${area.name}?
Most garden hedges need trimming 2 to 3 times per year. Fast growers like privet and leylandii may need more frequent attention. We can set up a regular trimming schedule so you never have to worry about it.

### Can you reduce an overgrown hedge?
Yes. We regularly reduce hedge height and width for customers in ${area.name}. Most hedges can be cut back hard and will recover well. We'll advise if gradual reduction is better for the species.

### Do you remove hedge clippings?
All clippings are removed as part of our service. We take them away for composting or proper disposal.

### Is there a time of year you can't trim hedges?
We avoid heavy cutting during bird nesting season (March to August) where possible, as required by the Wildlife Act 2000. Light tidying and shaping is usually fine, but we always check for active nests first.

## Book Hedge Trimming in ${area.name}

Call **085 168 5170** for a free quote. We cover all of ${area.name} and surrounding areas including ${area.nearby}.
`
  };
}

function patioPaving(area) {
  return {
    slug: `patio-paving-installation-${area.slug}`,
    title: `Patio & Paving Installation ${area.name}`,
    seoTitle: `Patio Paving ${area.name} | Natural Stone & Concrete | Free Quotes`,
    seoDescription: `Expert patio and paving installation in ${area.name}, Co. Louth. Natural stone, porcelain, concrete slabs and block paving. Free quotes from Pete & Seamus.`,
    content: `
Thinking about a new patio in ${area.name}? Pete & Seamus are experienced patio and paving contractors covering ${area.name} and all of County Louth. We install patios, garden paths, driveways and paved areas using quality materials that last.

## Paving Services in ${area.name}

- **Patio installation** — natural stone, porcelain, concrete and Indian sandstone
- **Block paving** — driveways, paths and courtyards
- **Garden paths** — stepping stones, flagstone and gravel paths
- **Steps and edging** — brick, stone and concrete kerbing
- **Patio repairs** — re-laying sunken slabs, re-pointing joints
- **Patio cleaning** — pressure washing and re-sanding
- **Drainage** — channel drains, soakaways and grading for water run-off

## Popular Paving Materials

We work with a wide range of paving materials. Here's what we recommend for ${area.name} gardens:

| Material | Best For | Price Range |
|----------|---------|-------------|
| Indian Sandstone | Patios, paths | €€ |
| Porcelain Paving | Modern patios, low maintenance | €€€ |
| Concrete Slabs | Budget patios, utility areas | € |
| Granite Setts | Edging, driveways, feature areas | €€€ |
| Block Paving | Driveways, courtyards | €€ |
| Limestone | Patios, paths (traditional look) | €€ |

${area.character === 'coastal' ? `For ${area.name}'s coastal location, we recommend porcelain or granite paving. These materials handle salt air and moisture exceptionally well and require minimal maintenance. Natural sandstone works too but benefits from sealing in coastal environments.` : area.character === 'mountain' ? `On the sloped terrain around ${area.name}, proper base preparation and drainage are critical. We build patio areas with a minimum fall of 1:60 away from the house and install drainage where needed to handle rainwater run-off from the hills above.` : `For gardens in ${area.name}, Indian sandstone and porcelain are our most popular choices. Both look great, are hard-wearing, and suit the Irish climate. We'll bring samples so you can see how they look in your garden.`}

## How We Build a Patio

A patio that lasts starts with proper groundwork. Our process:

1. **Design and layout** — we mark out the patio area with string lines and check levels
2. **Excavation** — digging out to the correct depth (typically 200mm below finished level)
3. **Sub-base** — 100mm compacted MOT Type 1 stone for a solid foundation
4. **Mortar bed** — full mortar bed (not spot-bedding) for maximum support
5. **Slab laying** — careful placement with consistent joints and accurate levels
6. **Pointing** — joint compound or mortar pointing for a professional finish
7. **Clean-up** — we wash down the patio and remove all waste material

## Patio Costs in ${area.name}

Patio prices vary depending on size, materials and site conditions:

| Patio Size | Concrete Slabs | Indian Sandstone | Porcelain |
|-----------|---------------|-----------------|-----------|
| Small (10m²) | From €1,200 | From €1,800 | From €2,200 |
| Medium (20m²) | From €2,000 | From €3,200 | From €4,000 |
| Large (30m²+) | From €2,800 | From €4,500 | From €5,500 |

Prices include excavation, sub-base, laying and pointing. Old patio removal is quoted separately.

## Frequently Asked Questions

### How long does a patio take to install in ${area.name}?
A typical 20m² patio takes 3 to 5 days to complete, including excavation and base preparation. Larger or more complex projects may take a week or more.

### Do I need planning permission for a patio?
Most garden patios are exempt from planning permission. However, if you're significantly changing ground levels or affecting drainage, it's worth checking with the local authority. We can advise during the consultation.

### What about drainage?
We always design patios with a slight fall (slope) to direct rainwater away from the house. Where needed, we install channel drains or connect to existing drainage systems.

### Can you lay paving over an existing patio?
In some cases, yes — if the existing patio is level and structurally sound. However, overlaying can raise the finished level, which may affect door thresholds or damp-proof courses. We'll assess this on site.

## Get a Free Patio Quote

Call Pete & Seamus on **085 168 5170** to arrange a free site visit and quotation in ${area.name}. We'll help you choose the right materials and design for your space.
`
  };
}

function gardenClearance(area) {
  return {
    slug: `garden-clearance-${area.slug}`,
    title: `Garden Clearance ${area.name}`,
    seoTitle: `Garden Clearance ${area.name} | Rubbish & Green Waste Removal`,
    seoDescription: `Professional garden clearance in ${area.name}, Co. Louth. Overgrown garden clearing, green waste removal, rubbish clearance and site preparation. Free quotes.`,
    content: `
Need a garden cleared in ${area.name}? Pete & Seamus provide complete garden clearance services across ${area.name} and County Louth. Whether it's an overgrown jungle, a property clean-up, or clearing before a landscaping project, we handle the heavy lifting so you don't have to.

## Garden Clearance Services in ${area.name}

- **Overgrown garden clearing** — brambles, nettles, long grass and weeds
- **Green waste removal** — branches, hedge clippings, grass and leaves
- **Rubbish and debris removal** — old garden furniture, broken fencing, rubble
- **Site preparation** — clearing ground for landscaping, paving or building
- **Tree and shrub removal** — small tree felling, stump removal, shrub clearance
- **End-of-tenancy garden clearance** — getting rental properties garden-ready
- **Estate and probate clearance** — sensitive, thorough garden clear-outs

## When You Might Need Garden Clearance

Gardens in ${area.name} can become overgrown quickly, especially if a property has been unoccupied or a garden has been neglected. Common situations where we help:

- **Moving into a new home** with a neglected garden
- **Preparing to sell** — a tidy garden improves property value
- **Landlords** getting rental properties ready between tenants
- **After building work** — clearing construction waste from the garden
- **Seasonal clear-outs** — autumn leaf clearance and end-of-year tidy-ups

${area.character === 'coastal' ? `Coastal gardens in ${area.name} often accumulate windblown debris, sand and salt-damaged plants that need regular clearing to keep the garden manageable.` : area.character === 'mountain' ? `In ${area.name}, the wetter conditions on the hillside mean gardens can become overgrown rapidly. Brambles and native scrub can take over quickly if not managed.` : `The fertile ${area.soilNote} in ${area.name} means vegetation grows vigorously — an untended garden can become a serious project within a single growing season.`}

## How We Work

1. **Free assessment** — we visit, walk the garden and agree what needs clearing
2. **Clearance day** — our team arrives with all the tools and equipment needed
3. **Systematic clearing** — we work through the garden methodically, separating recyclable green waste from general rubbish
4. **Waste disposal** — all waste removed from site. Green waste is composted; other waste goes to licensed facilities
5. **Finished garden** — we leave the space clear, tidy and ready for its next chapter

## Pricing for Garden Clearance in ${area.name}

Every garden is different, so we quote on site. As a rough guide:

| Job Size | Typical Price |
|----------|--------------|
| Small clear-up (trailer load) | From €150 |
| Medium clearance (half-day) | From €300 |
| Full garden clearance (full day) | From €500 |
| Major overgrown clearance (multi-day) | Quoted on site |

Prices include all labour, tools, equipment and waste disposal.

## Frequently Asked Questions

### How long does a garden clearance take in ${area.name}?
A small to medium garden clearance typically takes half a day to a full day. Heavily overgrown gardens or larger properties may take 2 to 3 days. We'll give you a realistic timeline after the site visit.

### Do you dispose of all waste?
Yes — we take everything away. Green waste is separated for composting, and all other materials are disposed of at licensed facilities. We don't fly-tip or leave anything behind.

### Can you clear a garden that's been neglected for years?
Absolutely. We regularly clear gardens in ${area.name} that haven't been touched in years. No job is too overgrown. We have the tools and experience to deal with heavy bramble, scrub, and accumulated rubbish.

### Do you offer regular maintenance after clearance?
Yes — once we've cleared your garden, we can set up a regular maintenance schedule to keep it under control. Many customers in ${area.name} start with a clearance and then move to fortnightly or monthly maintenance visits.

## Book a Free Assessment

Call Pete & Seamus on **085 168 5170** to arrange a free site visit in ${area.name}. We'll assess the garden, discuss what needs doing, and give you an honest quote.
`
  };
}

// ── Service Map ────────────────────────────────────────────────────────────────

const serviceGenerators = [
  { prefix: 'grass-cutting-lawn-care', fn: grassCutting },
  { prefix: 'garden-maintenance', fn: gardenMaintenance },
  { prefix: 'garden-landscaping', fn: gardenLandscaping },
  { prefix: 'decking-services', fn: deckingServices },
  { prefix: 'fencing-installation', fn: fencingInstallation },
  { prefix: 'hedge-trimming-services', fn: hedgeTrimming },
  { prefix: 'patio-paving-installation', fn: patioPaving },
  { prefix: 'garden-clearance', fn: gardenClearance },
];

// ── Hub/Parent Pages (service without area) ────────────────────────────────────

function generateHubPages() {
  const hubs = [];

  hubs.push({
    slug: 'grass-cutting-lawn-care',
    title: 'Grass Cutting & Lawn Care Services',
    seoTitle: 'Grass Cutting & Lawn Care | Dundalk & County Louth | From €25',
    seoDescription: 'Professional grass cutting and lawn mowing across Dundalk and County Louth. Weekly and fortnightly cuts, edge trimming, lawn treatments. Free quotes.',
    content: `
Professional grass cutting and lawn care across Dundalk and County Louth. Pete & Seamus offer weekly, fortnightly and one-off lawn mowing services for homes and businesses throughout the region.

## Our Lawn Care Services

- Weekly and fortnightly mowing schedules
- One-off cuts for overgrown lawns
- Edge trimming and strimming
- Lawn feeding and weed treatment
- Moss control and scarifying
- New lawn installation (turf and seed)

## Areas We Cover

We provide grass cutting services across County Louth including Dundalk, Blackrock, Carlingford, Ardee, Castlebellingham, Annagassan, and all surrounding villages. See our [areas page](/areas/) for the full list.

## Pricing

Grass cutting starts from **€25 per cut** for a small lawn. We offer discounts for regular weekly or fortnightly customers. Every quote is free with no obligation.

Call **085 168 5170** for a free quote today.
`
  });

  hubs.push({
    slug: 'garden-maintenance',
    title: 'Garden Maintenance Services',
    seoTitle: 'Garden Maintenance Dundalk & County Louth | Regular & One-Off',
    seoDescription: 'Complete garden maintenance across Dundalk and County Louth. Weeding, pruning, mowing, planting and seasonal clean-ups. 35+ years experience. Free quotes.',
    content: `
Complete garden maintenance services across Dundalk and County Louth. From regular weekly visits to one-off garden clean-ups, Pete & Seamus handle everything to keep your outdoor space looking its best.

## What We Cover

- Regular garden maintenance visits
- Weeding, pruning and deadheading
- Lawn mowing and edging
- Seasonal planting and bed preparation
- Spring and autumn garden clean-ups
- Pressure washing paths and patios

## How It Works

We visit your garden on a regular schedule — weekly, fortnightly or monthly — and take care of all routine tasks. Each visit covers mowing, edging, weeding and any seasonal work that's due. We bring all tools and take all waste away.

## Pricing

Regular maintenance starts from **€40 per visit** depending on garden size and work required. Call **085 168 5170** for a free garden assessment and quote.
`
  });

  hubs.push({
    slug: 'paving',
    title: 'Patio & Paving Services',
    seoTitle: 'Patio & Paving Installation Dundalk | Natural Stone & Concrete',
    seoDescription: 'Expert patio and paving installation in Dundalk and County Louth. Indian sandstone, porcelain, concrete and block paving. Free quotes from Pete & Seamus.',
    content: `
Expert patio and paving installation across Dundalk and County Louth. Pete & Seamus install quality patios, garden paths, driveways and paved areas using a wide range of natural stone, porcelain and concrete materials.

## Our Paving Services

- New patio installation
- Garden paths and stepping stones
- Block paving driveways
- Patio repairs and re-laying
- Steps, edging and kerbing
- Patio cleaning and restoration

## Materials We Work With

We use Indian sandstone, porcelain, limestone, granite setts, concrete slabs and block paving. We source materials from Ireland's leading suppliers and can bring samples for you to compare.

## Pricing

Patios start from **€1,200** for a small area. Every project includes proper excavation, compacted sub-base, full mortar bed and professional pointing. Call **085 168 5170** for a free site visit and quote.
`
  });

  hubs.push({
    slug: 'fencing',
    title: 'Fencing Services',
    seoTitle: 'Fencing Installation Dundalk & County Louth | All Types',
    seoDescription: 'Professional fencing installation in Dundalk and County Louth. PVC, timber panel, post and rail, concrete fencing. Repairs and new installations. Free quotes.',
    content: `
Professional fencing installation and repairs across Dundalk and County Louth. Pete & Seamus install all types of garden and boundary fencing — from timber panels to PVC, concrete post and panel, and post and rail.

## Fencing Types We Install

- PVC / uPVC fencing (maintenance-free)
- Timber panel fencing (closeboard, lap panel)
- Concrete post and panel
- Post and rail fencing
- Composite fencing
- Gates (timber, PVC and metal)

## What's Included

Every fencing job includes removal of old fencing (if required), new post installation, panel fitting, and a tidy finish. We dispose of all old materials responsibly.

## Pricing

Fencing starts from **€30 per metre** for post and rail, from **€40 per metre** for timber panels. Call **085 168 5170** for a free measurement and quote.
`
  });

  hubs.push({
    slug: 'hedge-trimming-cutting',
    title: 'Hedge Trimming & Cutting Services',
    seoTitle: 'Hedge Trimming Dundalk & County Louth | All Hedge Types',
    seoDescription: 'Professional hedge trimming and cutting across Dundalk and County Louth. Privet, laurel, leylandii, beech and native hedges. Fully insured. Free quotes.',
    content: `
Professional hedge trimming and cutting across Dundalk and County Louth. Pete & Seamus handle all hedge types and sizes — from small garden hedges to large boundary hedgerows.

## Hedge Services

- Regular hedge trimming and shaping
- Hedge reduction (height and width)
- Hedge removal and stump grinding
- New hedge planting
- Overgrown hedge restoration

## Common Hedges We Trim

We work with privet, laurel, leylandii, beech, griselinia, escallonia and native mixed hedgerows. Each species has its own optimal trimming time, and we schedule accordingly.

## Pricing

Hedge trimming starts from **€60** for a small garden hedge. We remove all cuttings and leave your garden tidy. Call **085 168 5170** for a free quote.
`
  });

  hubs.push({
    slug: 'garden-clearance',
    title: 'Garden Clearance Services',
    seoTitle: 'Garden Clearance Dundalk & County Louth | Green Waste Removal',
    seoDescription: 'Professional garden clearance across Dundalk and County Louth. Overgrown gardens, green waste removal, rubbish clearance and site prep. Free quotes.',
    content: `
Professional garden clearance services across Dundalk and County Louth. Pete & Seamus clear overgrown gardens, remove green waste, and prepare sites for landscaping or new planting.

## What We Clear

- Overgrown gardens (brambles, nettles, weeds)
- Green waste (branches, clippings, leaves)
- Garden rubbish and debris
- Old fencing, sheds and structures
- Site preparation for building or landscaping

## Waste Disposal

All waste is removed from site. Green waste is composted; other materials go to licensed disposal facilities. We never leave anything behind.

## Pricing

Garden clearance starts from **€150** for a small clear-up. Larger jobs are quoted after a free site visit. Call **085 168 5170** for a free assessment.
`
  });

  return hubs;
}

// ── Dundalk-specific service pages ──────────────────────────────────────────────

function generateDundalkPages() {
  return [
    {
      slug: 'garden-landscaping-dundalk',
      title: 'Garden Landscaping Dundalk',
      seoTitle: 'Garden Landscaping Dundalk | Design & Build | Free Quotes',
      seoDescription: 'Professional garden landscaping in Dundalk. Full design and build — patios, planting, lawns, retaining walls and more. 35+ years experience. Free quotes.',
      content: `
Looking for garden landscaping in Dundalk? Pete & Seamus are Dundalk's trusted landscaping team with over 35 years of combined experience. We design and build beautiful, practical gardens for homes and businesses across the town.

## What We Do

- Complete garden redesigns
- Patio and paving installation
- Retaining walls and raised beds
- Lawn installation (turf and seed)
- Planting schemes and borders
- Garden lighting and drainage
- Steps, paths and edging

## Local Expertise

As Dundalk locals, we know the town's gardens inside out. From the older estates in the town centre to newer developments on the outskirts, we've landscaped gardens across every part of Dundalk. We understand the local soil conditions, planning requirements and what works best in this climate.

## Get a Free Quote

Call **085 168 5170** to arrange a free site visit and quotation. We'll discuss your ideas, assess the site, and provide an honest, detailed quote with no obligation.
`
    },
    {
      slug: 'decking-services-dundalk',
      title: 'Decking Services Dundalk',
      seoTitle: 'Decking Installation Dundalk | Timber & Composite | Free Quotes',
      seoDescription: 'Professional decking installation in Dundalk. Timber and composite decking, repairs, cleaning and staining. Free quotes from Pete & Seamus.',
      content: `
Professional decking installation in Dundalk from Pete & Seamus. We build quality timber and composite decking for homes and businesses across Dundalk town and the surrounding area.

## Our Decking Services

- New timber and composite decking
- Raised and ground-level decks
- Steps, handrails and balustrades
- Built-in seating and planters
- Decking repairs and board replacement
- Cleaning, sanding and re-staining

## Timber vs Composite

We install both options and can advise which suits your garden, budget and lifestyle. Timber costs less upfront but needs annual treatment. Composite costs more but is virtually maintenance-free and lasts 25+ years.

## Pricing

Timber decking from **€65 per m²**, composite from **€120 per m²** (supply and fit). Call **085 168 5170** for a free measurement and quote in Dundalk.
`
    },
    {
      slug: 'outdoor-rooms-garden-sheds-dundalk',
      title: 'Outdoor Rooms & Garden Sheds Dundalk',
      seoTitle: 'Outdoor Rooms & Garden Sheds Dundalk | Custom Builds | Free Quotes',
      seoDescription: 'Custom outdoor rooms and garden sheds in Dundalk. Home offices, she-sheds, garden studios and storage solutions. Built to last. Free quotes.',
      content: `
Custom outdoor rooms and garden sheds in Dundalk from Pete & Seamus. Whether you need a home office, garden studio, workshop or simple storage shed, we design and build outdoor structures to suit your space and budget.

## What We Build

- Garden offices and home workspaces
- Garden studios and creative spaces
- Storage sheds and tool stores
- Summer houses and outdoor rooms
- Workshop and hobby spaces

## Why Choose a Garden Room?

A well-built garden room adds usable space to your property without the cost and disruption of a house extension. Our structures are insulated, weatherproof and wired for electricity, making them comfortable year-round.

## Get a Quote

Call **085 168 5170** to discuss your outdoor building project. We'll visit your garden in Dundalk, take measurements, and provide a detailed quote.
`
    }
  ];
}

// ── Generate All Pages ─────────────────────────────────────────────────────────

function generateMarkdown(pageData) {
  const frontmatter = [
    '---',
    `title: "${pageData.title}"`,
    `slug: "${pageData.slug}"`,
    `seoTitle: "${pageData.seoTitle}"`,
    `seoDescription: "${pageData.seoDescription}"`,
    '---',
  ].join('\n');

  return frontmatter + '\n' + pageData.content.trim() + '\n';
}

// Generate all pages
let count = 0;

// 1. Service × Area combination pages
for (const service of serviceGenerators) {
  for (const area of areas) {
    const pageData = service.fn(area);
    const filename = `${pageData.slug}.md`;
    const filepath = join(OUTPUT_DIR, filename);
    writeFileSync(filepath, generateMarkdown(pageData), 'utf-8');
    count++;
  }
}

// 2. Hub/parent pages
for (const hub of generateHubPages()) {
  const filename = `${hub.slug}.md`;
  const filepath = join(OUTPUT_DIR, filename);
  writeFileSync(filepath, generateMarkdown(hub), 'utf-8');
  count++;
}

// 3. Dundalk-specific pages
for (const page of generateDundalkPages()) {
  const filename = `${page.slug}.md`;
  const filepath = join(OUTPUT_DIR, filename);
  writeFileSync(filepath, generateMarkdown(page), 'utf-8');
  count++;
}

console.log(`\n✅ Generated ${count} service-area pages with unique content`);
console.log(`   Output: ${OUTPUT_DIR}`);
