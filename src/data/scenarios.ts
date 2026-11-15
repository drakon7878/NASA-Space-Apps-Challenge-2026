export type CrisisEffectType =
  | 'hull_leak'
  | 'zero_g_fire'
  | 'debris_alert'
  | 'solar_storm'
  | 'thermal_spike'
  | 'eva_tether';

export interface AstronautProfile {
  id: string;
  name: string;
  role: string;
  suitTrim: string;
  visorGlow: string;
  side: 'left' | 'right' | 'center';
}

export interface ThoughtOption {
  id: string;
  text: string;
  isCorrect: boolean;
  outcomeHeadline: string;
  outcomeDetail: string;
}

export interface ThoughtSection {
  id: string;
  label: string;
  astronautId: string;
  statement: string;
  isFlawed: boolean;
  options: [ThoughtOption, ThoughtOption, ThoughtOption];
}

export interface SpaceScenario {
  id: string;
  title: string;
  sector: string;
  crisisEffect: CrisisEffectType;
  timerSeconds: number;
  eventSummary: string;
  astronauts: AstronautProfile[];
  sections: [ThoughtSection, ThoughtSection, ThoughtSection];
  timeoutHeadline: string;
  timeoutDetail: string;
  scienceTakeaway: string;
}

export const SPACE_SCENARIOS: SpaceScenario[] = [
  {
    id: 'hull-leak',
    title: 'Hull Micrometeoroid Puncture',
    sector: 'Sector 4 · Storage Bay',
    crisisEffect: 'hull_leak',
    timerSeconds: 45,
    eventSummary:
      'A high-velocity micrometeoroid pierces the outer hull near the cargo crates. Cabin air whistles into space as pressure gauges drop.',
    astronauts: [
      {
        id: 'elena',
        name: 'Cmdr. Elena Vance',
        role: 'Station Commander',
        suitTrim: '#38bdf8',
        visorGlow: '#7dd3fc',
        side: 'center',
      },
    ],
    sections: [
      {
        id: 'hull-s1',
        label: 'Telemetry Check',
        astronautId: 'elena',
        statement:
          'Pressure sensors confirm a 2 cm breach behind the bulkhead—cabin air is escaping fast.',
        isFlawed: false,
        options: [
          {
            id: 'hull-s1-o1',
            text: 'Ignore the gauge drop—pressure fluctuations are just normal humidity cycling.',
            isCorrect: false,
            outcomeHeadline: 'Breach Ignored',
            outcomeDetail:
              'You overwrote an accurate telemetry reading. Elena leaves the breach unsealed, and cabin oxygen plummets dangerously.',
          },
          {
            id: 'hull-s1-o2',
            text: 'The hole only disrupts artificial gravity plating, not breathable cabin air.',
            isCorrect: false,
            outcomeHeadline: 'Misdiagnosed System',
            outcomeDetail:
              'Orbital stations do not use gravity plating, and the hull breach keeps bleeding precious atmosphere into vacuum.',
          },
          {
            id: 'hull-s1-o3',
            text: 'Wait 15 minutes to see if cold welding seals the aluminum wall automatically.',
            isCorrect: false,
            outcomeHeadline: 'Delayed Response',
            outcomeDetail:
              'Cold welding requires clean, unoxidized metal surfaces pressed together in contact—waiting only drains the module of air.',
          },
        ],
      },
      {
        id: 'hull-s2',
        label: 'Vacuum Physics',
        astronautId: 'elena',
        statement:
          'Space is a vacuum that actively sucks like a magnet, so I must vent the airlock and patch it from outside.',
        isFlawed: true,
        options: [
          {
            id: 'hull-s2-o1',
            text: 'Space does not suck—internal air pushes outward, so slap the patch onto the inside wall.',
            isCorrect: true,
            outcomeHeadline: 'Differential Pressure Sealed It',
            outcomeDetail:
              'Elena presses the flexible patch from inside. The 1-atmosphere cabin air pushes the patch tightly against the hull, sealing the leak instantly.',
          },
          {
            id: 'hull-s2-o2',
            text: 'Shut off all oxygen scrubbers immediately so the vacuum has nothing left to pull on.',
            isCorrect: false,
            outcomeHeadline: 'Atmosphere Starved',
            outcomeDetail:
              'Stopping scrubbers lets CO2 spike while air still escapes through the breach through basic gas expansion.',
          },
          {
            id: 'hull-s2-o3',
            text: 'Spray liquid water at the puncture so boiling steam pushes back against the vacuum.',
            isCorrect: false,
            outcomeHeadline: 'Ice Crystals & Fog',
            outcomeDetail:
              'Water flashes to vapor and ice crystals in low pressure without sealing the metal, wasting water and obscuring visibility.',
          },
        ],
      },
      {
        id: 'hull-s3',
        label: 'Patch Kit',
        astronautId: 'elena',
        statement:
          'Grab the flexible polymer seal pad and emergency pressure tape from the locker.',
        isFlawed: false,
        options: [
          {
            id: 'hull-s3-o1',
            text: 'Use a rigid glass viewport pane instead—it cannot bend under pressure.',
            isCorrect: false,
            outcomeHeadline: 'Shattered Seal',
            outcomeDetail:
              'You replaced the right tool with brittle glass. Uneven hull curvature cracks the pane under pressure.',
          },
          {
            id: 'hull-s3-o2',
            text: 'Stuff dry paper towels into the hole so fibers catch the outgoing airflow.',
            isCorrect: false,
            outcomeHeadline: 'Porous Failure',
            outcomeDetail:
              'Paper towels are porous and flammable; pressurized air whistles straight through them.',
          },
          {
            id: 'hull-s3-o3',
            text: 'Leave the kit stowed and plug the sharp jagged metal hole with a bare glove.',
            isCorrect: false,
            outcomeHeadline: 'Suit Puncture Risk',
            outcomeDetail:
              'Pressing a glove against sharp micrometeoroid burrs risks tearing suit layers and injuring the crewmember.',
          },
        ],
      },
    ],
    timeoutHeadline: 'Airlock Vented Unnecessarily',
    timeoutDetail:
      'Without 4D intervention, Elena followed her flawed hunch and vented the airlock, draining reserve air while trying to patch from outside.',
    scienceTakeaway:
      'A vacuum exerts zero pulling force. Air escapes because high-pressure cabin gas pushes outward—meaning interior patches naturally clamp tight against the hull.',
  },
  {
    id: 'zero-g-fire',
    title: 'Zero-G Avionics Fire',
    sector: 'Deck 2 · Cooling Manifold',
    crisisEffect: 'zero_g_fire',
    timerSeconds: 45,
    eventSummary:
      'An overloaded power bus sparks behind the cooling rack. An eerie, quiet blue spherical flame hovers in microgravity.',
    astronauts: [
      {
        id: 'leo',
        name: 'Eng. Leo Park',
        role: 'Flight Engineer',
        suitTrim: '#f59e0b',
        visorGlow: '#fcd34d',
        side: 'left',
      },
      {
        id: 'maya',
        name: 'Spec. Maya Lin',
        role: 'Life Support Lead',
        suitTrim: '#2dd4bf',
        visorGlow: '#5eead4',
        side: 'right',
      },
    ],
    sections: [
      {
        id: 'fire-s1',
        label: 'Flame Behavior',
        astronautId: 'leo',
        statement:
          'Without buoyancy in microgravity, hot gas will not rise—that is why the flame forms a slow sphere.',
        isFlawed: false,
        options: [
          {
            id: 'fire-s1-o1',
            text: 'The flame is blue only because the metal pipes are cold; it will shoot straight up shortly.',
            isCorrect: false,
            outcomeHeadline: 'Convection Misconception',
            outcomeDetail:
              'Without gravity-driven buoyancy, hot exhaust never rises upward. Leo misreads how fast smoke spreads spherically.',
          },
          {
            id: 'fire-s1-o2',
            text: 'Blue flames in space are harmless plasma illusions caused by solar static.',
            isCorrect: false,
            outcomeHeadline: 'Fire Ignored',
            outcomeDetail:
              'Microgravity hydrocarbon and wire insulation fires often burn blue and nearly invisible—treating it as static lets wiring melt.',
          },
          {
            id: 'fire-s1-o3',
            text: 'Zero gravity eliminates combustion completely, so the glow will vanish on its own.',
            isCorrect: false,
            outcomeHeadline: 'Combustion Continues',
            outcomeDetail:
              'Combustion only needs fuel, heat, and oxygen—all present inside the pressurized station.',
          },
        ],
      },
      {
        id: 'fire-s2',
        label: 'Power Isolation',
        astronautId: 'leo',
        statement:
          'Cut electrical power to the avionics bus immediately before discharging any extinguisher.',
        isFlawed: false,
        options: [
          {
            id: 'fire-s2-o1',
            text: 'Keep the bus at full voltage so telemetry stays online while we spray water.',
            isCorrect: false,
            outcomeHeadline: 'Electrical Arc Hazard',
            outcomeDetail:
              'Spraying conductive liquid on an energized bus triggers violent short circuits and toxic smoke.',
          },
          {
            id: 'fire-s2-o2',
            text: 'Increase voltage to the rack so the circuit breakers trip automatically in 5 minutes.',
            isCorrect: false,
            outcomeHeadline: 'Thermal Runaway',
            outcomeDetail:
              'Overdriving a shorted bus turns wire insulation into dense toxic fumes before breakers react.',
          },
          {
            id: 'fire-s2-o3',
            text: 'Wrap the sparking live cables in aluminum foil to reflect heat away.',
            isCorrect: false,
            outcomeHeadline: 'Dead Short Created',
            outcomeDetail:
              'Conductive aluminum foil bridges exposed terminals and intensifies the electrical arc.',
          },
        ],
      },
      {
        id: 'fire-s3',
        label: 'Airflow Control',
        astronautId: 'maya',
        statement:
          'Let us crank the cabin ventilation fans to maximum to blow this flame out like a birthday candle!',
        isFlawed: true,
        options: [
          {
            id: 'fire-s3-o1',
            text: 'Shut down cabin airflow so the flame suffocates in its own CO2 shell, then apply CO2 extinguisher.',
            isCorrect: true,
            outcomeHeadline: 'Fire Starved of Oxygen',
            outcomeDetail:
              'Maya cuts the fans. Deprived of fresh convection airflow, the spherical flame dims in its own exhaust and dies under a clean CO2 burst.',
          },
          {
            id: 'fire-s3-o2',
            text: 'Pump pure 100% oxygen into the module to cool the burning copper wires.',
            isCorrect: false,
            outcomeHeadline: 'Flash Fire Surge',
            outcomeDetail:
              'Pure oxygen turns smoldering insulation into a roaring firestorm.',
          },
          {
            id: 'fire-s3-o3',
            text: 'Crack open the corridor hatch so vacuum drafts pull the heat sideways.',
            isCorrect: false,
            outcomeHeadline: 'Turbulent Oxygen Draft',
            outcomeDetail:
              'Rushing cabin air acts like a bellows, fanning the smoldering rack into open flame while losing air pressure.',
          },
        ],
      },
    ],
    timeoutHeadline: 'Ventilation Fans Fed the Blaze',
    timeoutDetail:
      'Maya maxed out the fans. In microgravity, forced air supplies fresh oxygen to a flame that was otherwise suffocating in its own CO2.',
    scienceTakeaway:
      'In microgravity, fires cannot rely on warm-air convection to draw fresh oxygen. Turning OFF ventilation fans starves a zero-G fire of oxygen immediately.',
  },
  {
    id: 'debris-dodge',
    title: 'Orbital Debris Trajectory',
    sector: 'Observatory Viewport · 408 km LEO',
    crisisEffect: 'debris_alert',
    timerSeconds: 45,
    eventSummary:
      'Tracking radar flags a defunct satellite bolt intersecting our orbit in 3 minutes. A direct hit could breach the hull.',
    astronauts: [
      {
        id: 'kenji',
        name: 'Nav. Kenji Sato',
        role: 'Flight Dynamics',
        suitTrim: '#a78bfa',
        visorGlow: '#c4b5fd',
        side: 'left',
      },
      {
        id: 'samira',
        name: 'Pilot Samira Cruz',
        role: 'Orbital Pilot',
        suitTrim: '#38bdf8',
        visorGlow: '#7dd3fc',
        side: 'right',
      },
    ],
    sections: [
      {
        id: 'deb-s1',
        label: 'Thruster Vector',
        astronautId: 'kenji',
        statement:
          'To drop to a lower altitude out of its path right now, fire thrusters straight downward toward Earth!',
        isFlawed: true,
        options: [
          {
            id: 'deb-s1-o1',
            text: 'Fire retrograde or prograde along our orbital path—speed change shifts altitude efficiently.',
            isCorrect: true,
            outcomeHeadline: 'Clean Orbital Phase Shift',
            outcomeDetail:
              'Kenji aligns the burn along the velocity vector. Changing orbital speed smoothly shifts altitude and timing, letting the bolt pass harmlessly.',
          },
          {
            id: 'deb-s1-o2',
            text: 'Spin the station rapidly like a gyroscope so debris glances off the hull.',
            isCorrect: false,
            outcomeHeadline: 'Centrifugal Strain',
            outcomeDetail:
              'Spinning does not change orbital intersection and places dangerous structural loads on solar arrays.',
          },
          {
            id: 'deb-s1-o3',
            text: 'Cut gyroscopes so Earth gravity gently pulls the station straight down out of orbit.',
            isCorrect: false,
            outcomeHeadline: 'Freefall Remains Unchanged',
            outcomeDetail:
              'The station is already in perpetual freefall around Earth; disabling attitude gyroscopes will not alter its orbital path.',
          },
        ],
      },
      {
        id: 'deb-s2',
        label: 'Impact Energy',
        astronautId: 'samira',
        statement:
          'At 7.8 km/s orbital speed, even a tiny metal bolt carries catastrophic kinetic energy.',
        isFlawed: false,
        options: [
          {
            id: 'deb-s2-o1',
            text: 'A small bolt weighs under 50 grams, so the outer aluminum paneling will deflect it harmlessly.',
            isCorrect: false,
            outcomeHeadline: 'Underestimated Hypervelocity',
            outcomeDetail:
              'Kinetic energy scales with velocity squared (1/2 mv^2). At 7.8 km/s, a 50g bolt strikes with the energy of an artillery shell.',
          },
          {
            id: 'deb-s2-o2',
            text: 'Both objects are in space weightlessness, so the bolt has zero momentum on impact.',
            isCorrect: false,
            outcomeHeadline: 'Mass vs Weight Confusion',
            outcomeDetail:
              'Weightlessness means zero apparent weight, NOT zero mass or momentum. High relative velocity remains lethal.',
          },
          {
            id: 'deb-s2-o3',
            text: 'Earth atmosphere at 408 km will slow the bolt down before it reaches our hull.',
            isCorrect: false,
            outcomeHeadline: 'Negligible Drag Error',
            outcomeDetail:
              'At 408 km altitude, air drag takes months or years to slow debris—never seconds.',
          },
        ],
      },
      {
        id: 'deb-s3',
        label: 'Crew Readiness',
        astronautId: 'samira',
        statement:
          'Secure loose cargo crates and brace crew handles before firing the main avoidance burn.',
        isFlawed: false,
        options: [
          {
            id: 'deb-s3-o1',
            text: 'Leave cargo floating freely so inertia automatically cushions the station during thrust.',
            isCorrect: false,
            outcomeHeadline: 'Internal Projectiles',
            outcomeDetail:
              'When thrusters accelerate the hull, unrestrained crates slam backward across the cabin at high speed.',
          },
          {
            id: 'deb-s3-o2',
            text: 'Brace directly against the fragile glass viewport during maximum thrust.',
            isCorrect: false,
            outcomeHeadline: 'Viewport Stress',
            outcomeDetail:
              'Pressing equipment or body weight against viewport seals during acceleration risks structural damage.',
          },
          {
            id: 'deb-s3-o3',
            text: 'Unstrap all crew harnesses so everyone floats neutrally without feeling acceleration.',
            isCorrect: false,
            outcomeHeadline: 'Unrestrained Crew Impact',
            outcomeDetail:
              'During a burn, the ship accelerates while unstrapped astronauts stay behind by inertia, colliding with bulkheads.',
          },
        ],
      },
    ],
    timeoutHeadline: 'Radial Burn Twisted the Orbit',
    timeoutDetail:
      'Firing straight toward Earth distorted orbital eccentricity without reliably clearing the debris corridor, forcing an emergency Whipple-shield impact.',
    scienceTakeaway:
      'Orbital mechanics is counterintuitive: firing radially toward Earth tilts your orbit and wastes fuel. To shift altitude cleanly, burn prograde (forward) or retrograde (backward).',
  },
  {
    id: 'solar-proton-storm',
    title: 'Solar Proton Storm',
    sector: 'Science Corridor · Solar Watch',
    crisisEffect: 'solar_storm',
    timerSeconds: 45,
    eventSummary:
      'An X-class solar flare erupts. Charged high-energy protons are sweeping past the station viewport right now.',
    astronauts: [
      {
        id: 'aris',
        name: 'Dr. Aris Thorne',
        role: 'Astrophysicist',
        suitTrim: '#34d399',
        visorGlow: '#6ee7b7',
        side: 'center',
      },
    ],
    sections: [
      {
        id: 'sol-s1',
        label: 'Arrival Physics',
        astronautId: 'aris',
        statement:
          'X-ray light from the flare hit us in 8 minutes, and the slower charged protons are arriving now.',
        isFlawed: false,
        options: [
          {
            id: 'sol-s1-o1',
            text: 'Protons travel faster than light, so the dangerous wave already passed two hours ago.',
            isCorrect: false,
            outcomeHeadline: 'Relativity Violation',
            outcomeDetail:
              'Nothing with mass exceeds the speed of light. Aris drops shielding early right as peak proton flux hits.',
          },
          {
            id: 'sol-s1-o2',
            text: 'Solar storms are just acoustic shockwaves moving through empty space.',
            isCorrect: false,
            outcomeHeadline: 'Acoustic Vacuum Myth',
            outcomeDetail:
              'Sound waves cannot cross space vacuum; solar particle storms are ionizing radiation.',
          },
          {
            id: 'sol-s1-o3',
            text: 'The flare only affects the dark night side of Earth, never sunlit orbits.',
            isCorrect: false,
            outcomeHeadline: 'False Shelter Assumption',
            outcomeDetail:
              'Charged particles follow magnetic field lines and strike high-inclination orbits intensely.',
          },
        ],
      },
      {
        id: 'sol-s2',
        label: 'Radiation Shield',
        astronautId: 'aris',
        statement:
          'Let us huddle against the thick lead-lined wall—dense heavy metals block solar protons with zero side effects!',
        isFlawed: true,
        options: [
          {
            id: 'sol-s2-o1',
            text: 'Shelter inside the water-tank and polyethylene core—hydrogen-rich shielding avoids secondary X-rays.',
            isCorrect: true,
            outcomeHeadline: 'Hydrogen Shielding Effective',
            outcomeDetail:
              'Aris moves into the water-jacketed core. Light hydrogen nuclei slow incoming protons cleanly without generating secondary Bremsstrahlung radiation.',
          },
          {
            id: 'sol-s2-o2',
            text: 'Stand right in front of the glass viewport because clear quartz reflects charged protons.',
            isCorrect: false,
            outcomeHeadline: 'Exposed at Viewport',
            outcomeDetail:
              'Thin viewport panes offer almost zero proton attenuation, exposing the crew to peak radiation.',
          },
          {
            id: 'sol-s2-o3',
            text: 'Dump all station water reserves overboard to make the hull a smaller target.',
            isCorrect: false,
            outcomeHeadline: 'Shielding & Hydration Lost',
            outcomeDetail:
              'Dumping water removes the station’s best radiation absorber while crippling life support.',
          },
        ],
      },
      {
        id: 'sol-s3',
        label: 'Avionics Protection',
        astronautId: 'aris',
        statement:
          'Place non-essential star-trackers into safe mode to prevent single-event bit flips.',
        isFlawed: false,
        options: [
          {
            id: 'sol-s3-o1',
            text: 'Overclock navigation computers to outrun incoming charged particles.',
            isCorrect: false,
            outcomeHeadline: 'Memory Corruption',
            outcomeDetail:
              'High-frequency memory writes during proton bombardment increase single-event upsets and crash guidance.',
          },
          {
            id: 'sol-s3-o2',
            text: 'Disable error-correcting memory checks so logs do not fill up.',
            isCorrect: false,
            outcomeHeadline: 'Silent Data Faults',
            outcomeDetail:
              'Without error-correcting code (ECC), flipped bits corrupt attitude control commands.',
          },
          {
            id: 'sol-s3-o3',
            text: 'Point optical cameras straight into the Sun to measure proton brightness.',
            isCorrect: false,
            outcomeHeadline: 'Sensor Burnout',
            outcomeDetail:
              'Direct unfiltered solar exposure permanently damages sensitive star-tracker detectors.',
          },
        ],
      },
    ],
    timeoutHeadline: 'Secondary X-Rays Inside Shelter',
    timeoutDetail:
      'High-energy solar protons slammed into the dense lead wall, generating secondary Bremsstrahlung X-rays right inside the crew shelter.',
    scienceTakeaway:
      'Heavy metals like lead create dangerous secondary radiation when struck by high-energy cosmic protons. Water and hydrogen-rich plastics (polyethylene) are superior space shields.',
  },
  {
    id: 'thermal-spike',
    title: 'Radiator Coolant Failure',
    sector: 'Deck 3 · Thermal Control',
    crisisEffect: 'thermal_spike',
    timerSeconds: 45,
    eventSummary:
      'A coolant loop shuts down while direct sunlight bakes the hull. Cabin electronics and air temperatures are climbing rapidly.',
    astronauts: [
      {
        id: 'elena2',
        name: 'Cmdr. Elena Vance',
        role: 'Station Commander',
        suitTrim: '#38bdf8',
        visorGlow: '#7dd3fc',
        side: 'left',
      },
      {
        id: 'maya2',
        name: 'Spec. Maya Lin',
        role: 'Life Support Lead',
        suitTrim: '#2dd4bf',
        visorGlow: '#5eead4',
        side: 'right',
      },
    ],
    sections: [
      {
        id: 'thm-s1',
        label: 'Heat Transfer',
        astronautId: 'elena2',
        statement:
          'In vacuum, there is no outside air to carry cabin heat away by conduction or convection.',
        isFlawed: false,
        options: [
          {
            id: 'thm-s1-o1',
            text: 'Solar wind blows steadily across the hull, cooling us faster than ocean air.',
            isCorrect: false,
            outcomeHeadline: 'Negligible Solar Wind Cooling',
            outcomeDetail:
              'Solar wind density is near zero—it transfers practically no convective cooling away from the hull.',
          },
          {
            id: 'thm-s1-o2',
            text: 'Zero gravity makes warm air sink downward and automatically freeze inside floor pipes.',
            isCorrect: false,
            outcomeHeadline: 'Stagnant Heat Pockets',
            outcomeDetail:
              'Warm air neither rises nor sinks in microgravity—without fans, heat pools around equipment and crew.',
          },
          {
            id: 'thm-s1-o3',
            text: 'Metal walls cannot hold thermal energy once the station enters shadow.',
            isCorrect: false,
            outcomeHeadline: 'Thermal Mass Ignored',
            outcomeDetail:
              'Internal hardware keeps generating hundreds of kilowatts of heat regardless of brief orbital shadow.',
          },
        ],
      },
      {
        id: 'thm-s2',
        label: 'Heat Load',
        astronautId: 'elena2',
        statement:
          'Power down non-essential science furnaces and high-wattage racks to cut internal heat.',
        isFlawed: false,
        options: [
          {
            id: 'thm-s2-o1',
            text: 'Turn on every spare laboratory oven to equalize temperatures across all decks.',
            isCorrect: false,
            outcomeHeadline: 'Cabin Overheat',
            outcomeDetail:
              'Adding electrical power inside an insulated vessel converts directly into even more waste heat.',
          },
          {
            id: 'thm-s2-o2',
            text: 'Keep all high-draw computers at peak load so their cooling fans run faster.',
            isCorrect: false,
            outcomeHeadline: 'Net Heat Gain',
            outcomeDetail:
              'Internal fans just circulate warm air inside the cabin; running processors adds net heat.',
          },
          {
            id: 'thm-s2-o3',
            text: 'Switch cabin lights to maximum halogen brightness to burn off excess humidity.',
            isCorrect: false,
            outcomeHeadline: 'Thermal Spike Worsened',
            outcomeDetail:
              'Brighter lights dump more thermal watts into a station that already cannot reject heat.',
          },
        ],
      },
      {
        id: 'thm-s3',
        label: 'Rejection Method',
        astronautId: 'maya2',
        statement:
          'Space is -270°C freezing cold! If we just shut off hull heaters, the cold vacuum will instantly chill the station.',
        isFlawed: true,
        options: [
          {
            id: 'thm-s3-o1',
            text: 'Vacuum acts like a thermos—reroute coolant to our working infrared radiator panels to emit heat as light.',
            isCorrect: true,
            outcomeHeadline: 'Infrared Radiators Engaged',
            outcomeDetail:
              'Maya bypasses the damaged loop into backup thermal radiators. Excess heat is radiated away into deep space as infrared light.',
          },
          {
            id: 'thm-s3-o2',
            text: 'Crack open the storage hatch slightly so -270°C space air rushes through the pipes.',
            isCorrect: false,
            outcomeHeadline: 'Decompression Error',
            outcomeDetail:
              'Space has no cold air to rush in—opening a hatch only vents breathable cabin air outward.',
          },
          {
            id: 'thm-s3-o3',
            text: 'Run electric heaters in reverse polarity to suck coldness in through the bulkhead.',
            isCorrect: false,
            outcomeHeadline: 'Thermodynamic Impossibility',
            outcomeDetail:
              'Resistive heaters convert electricity into heat regardless of polarity, pushing cabin temperatures higher.',
          },
        ],
      },
    ],
    timeoutHeadline: 'Thermos Effect Overheated Avionics',
    timeoutDetail:
      'Shutting heaters did nothing—vacuum insulated the station like a giant thermos flask while electronics overheated without radiator routing.',
    scienceTakeaway:
      'Space is not cold to the touch because vacuum lacks matter for conduction or convection. Spacecraft stay cool only by emitting infrared radiation from radiator panels.',
  },
  {
    id: 'eva-tether',
    title: 'EVA Momentum Trap',
    sector: 'Exterior Hull · Airlock Zone',
    crisisEffect: 'eva_tether',
    timerSeconds: 45,
    eventSummary:
      'While inspecting an exterior strut, Samira’s thruster pack enters standby and her wrist tether unclips near the airlock.',
    astronauts: [
      {
        id: 'samira2',
        name: 'Pilot Samira Cruz',
        role: 'EVA Specialist',
        suitTrim: '#38bdf8',
        visorGlow: '#7dd3fc',
        side: 'center',
      },
    ],
    sections: [
      {
        id: 'eva-s1',
        label: 'Reaction Throw',
        astronautId: 'samira2',
        statement:
          'To pull myself back to the airlock, I will throw my heavy wrench straight toward the airlock hatch!',
        isFlawed: true,
        options: [
          {
            id: 'eva-s1-o1',
            text: 'Throw the spare mass away from the airlock—Newton’s Third Law pushes you directly toward the hatch.',
            isCorrect: true,
            outcomeHeadline: 'Equal & Opposite Drift Home',
            outcomeDetail:
              'Samira hurls the heavy tool bag into open space away from the station, gliding gently straight back onto the airlock handrail.',
          },
          {
            id: 'eva-s1-o2',
            text: 'Swim forward vigorously with both arms to build aerodynamic lift through space.',
            isCorrect: false,
            outcomeHeadline: 'Zero Drag in Vacuum',
            outcomeDetail:
              'Without air or water to push against, swimming motions only rotate Samira in place without shifting her center of mass.',
          },
          {
            id: 'eva-s1-o3',
            text: 'Spin your boots clockwise repeatedly to generate gravitational attraction toward the hull.',
            isCorrect: false,
            outcomeHeadline: 'Angular Spin Only',
            outcomeDetail:
              'Rotating limbs conserves total angular momentum and cannot pull a drifting astronaut closer to the station.',
          },
        ],
      },
      {
        id: 'eva-s2',
        label: 'Hull Contact',
        astronautId: 'samira2',
        statement:
          'If I push sharply off a loose panel, my mass accelerates away with equal and opposite momentum.',
        isFlawed: false,
        options: [
          {
            id: 'eva-s2-o1',
            text: 'Kick the hull as hard as possible—gravity boots will curve you back automatically in 10 seconds.',
            isCorrect: false,
            outcomeHeadline: 'Uncontrolled Drift',
            outcomeDetail:
              'Orbital stations lack magnetic boot recall; kicking off forcefully sends an untethered astronaut drifting away.',
          },
          {
            id: 'eva-s2-o2',
            text: 'Wait for air resistance outside the hull to bring your drift to a dead stop.',
            isCorrect: false,
            outcomeHeadline: 'No Stopping Friction',
            outcomeDetail:
              'At orbital altitude, air drag is far too faint to stop an EVA drift before oxygen runs low.',
          },
          {
            id: 'eva-s2-o3',
            text: 'Hold your breath so your lungs become heavier and pull you back to the hull.',
            isCorrect: false,
            outcomeHeadline: 'Zero Mass Change',
            outcomeDetail:
              'Holding air inside a sealed suit changes neither total mass nor center-of-mass velocity.',
          },
        ],
      },
      {
        id: 'eva-s3',
        label: 'Backup Thruster',
        astronautId: 'samira2',
        statement:
          'Verify SAFER cold-gas nitrogen pack pressure before releasing any remaining handhold.',
        isFlawed: false,
        options: [
          {
            id: 'eva-s3-o1',
            text: 'Vent your suit helmet oxygen valve directly—breathing gas works better than nitrogen packs.',
            isCorrect: false,
            outcomeHeadline: 'Suit Depressurization',
            outcomeDetail:
              'Deliberately venting breathing oxygen risks fatal suit depressurization when dedicated SAFER thrusters exist.',
          },
          {
            id: 'eva-s3-o2',
            text: 'Detach the SAFER pack completely so you weigh less and float back faster.',
            isCorrect: false,
            outcomeHeadline: 'Rescue Pack Discarded',
            outcomeDetail:
              'Discarding the SAFER unit eliminates emergency attitude and translation thrusters.',
          },
          {
            id: 'eva-s3-o3',
            text: 'Ignite a chemical flare to push you like a solid rocket booster.',
            isCorrect: false,
            outcomeHeadline: 'Thermal Suit Hazard',
            outcomeDetail:
              'Standard flares are unstable near oxygen-rich EVA suits and lack directional thrust control.',
          },
        ],
      },
    ],
    timeoutHeadline: 'Drifted Away From Hatch',
    timeoutDetail:
      'Throwing the wrench toward the airlock pushed Samira in the opposite direction—straight away from the station until emergency tethers caught her.',
    scienceTakeaway:
      'By conservation of momentum (Newton’s Third Law), throwing mass in one direction propels you in the exact opposite direction. To move toward safety, eject mass away from it.',
  },
];
