import { ScenarioQuestion, DetectiveBug, WorkflowStep } from '../types/gis';

export const MISSION_METADATA = [
  {
    id: 1,
    title: 'Decode the Coordinates',
    subtitle: 'Numbers alone are not enough',
    sourceRef: 'Sources 1–3',
    icon: 'Compass',
    description: 'Investigate mystery coordinates (2.30, 102.30) and learn how angular coordinates locate Melaka on the globe.',
  },
  {
    id: 2,
    title: 'Build the Earth Reference',
    subtitle: 'From irregular Earth to Datums & GCS',
    sourceRef: 'Sources 4–5',
    icon: 'Globe2',
    description: 'Explore the difference between real Earth, ellipsoids, datums (WGS 84 vs GDM2000), and Geographic Coordinate Systems.',
  },
  {
    id: 3,
    title: 'Flatten the Earth',
    subtitle: 'Projections & unavoidable distortion',
    sourceRef: 'Sources 6–7',
    icon: 'Layers',
    description: 'Experience the orange-peel dilemma, test map distortions, and convert curved degrees into linear metres (X/Y).',
  },
  {
    id: 4,
    title: 'Choose the Right CRS',
    subtitle: 'Matching scale, purpose & UTM zones',
    sourceRef: 'Sources 8–10',
    icon: 'MapPin',
    description: 'Navigate UTM Zones 47N and 48N across Malaysia and make critical CRS decisions for real GIS projects.',
  },
  {
    id: 5,
    title: 'CRS Detective & Workflow',
    subtitle: 'Diagnose misplaced layers & build the pipeline',
    sourceRef: 'Sources 11–12',
    icon: 'SearchCheck',
    description: 'Troubleshoot misplaced Melaka school layers in a GIS inspector, then assemble the complete 6-stage GIS workflow.',
  },
];

export const MISSION_1_QUESTIONS = {
  initialGuess: {
    question: 'A field surveyor gives you these numbers: (2.30, 102.30). Where on Earth is this?',
    options: [
      { id: 'sahara', label: 'Sahara Desert, Africa', isCorrect: false, feedback: 'Incorrect. Africa is around longitudes -20° to +50°. Longitude 102.30° is in Southeast Asia!' },
      { id: 'melaka', label: 'Melaka, Malaysia', isCorrect: true, feedback: 'Spot on! Latitude 2.30° N is just above the Equator, and Longitude 102.30° E places you right in Melaka, Malaysia.' },
      { id: 'australia', label: 'Perth, Australia', isCorrect: false, feedback: 'Incorrect. Perth is in the Southern Hemisphere (~31.95° S, 115.86° E).' },
    ],
    takeaway: 'Numbers alone have no meaning without an Earth reference. 2.30 and 102.30 are angular degrees measured from the Equator and Prime Meridian.',
  },
  anglesQuiz: [
    {
      id: 'lat_measure',
      question: 'What does Latitude measure and what is its reference baseline?',
      options: [
        { id: 'opt1', text: 'Measures North–South from the Equator (0° to 90°)', correct: true, expl: 'Latitude measures angular distance north (+) or south (-) of the Equator.' },
        { id: 'opt2', text: 'Measures East–West from the Prime Meridian (0° to 180°)', correct: false, expl: 'That is Longitude!' },
        { id: 'opt3', text: 'Measures elevation in metres above sea level', correct: false, expl: 'That is elevation/height (Z), not latitude.' },
      ],
    },
    {
      id: 'units_check',
      question: 'In a Geographic Coordinate System (GCS), what units are (2.30, 102.30)?',
      options: [
        { id: 'opt1', text: 'Metres (m)', correct: false, expl: 'If they were metres, 2.30 metres from the origin would be inside the Gulf of Guinea at the null point!' },
        { id: 'opt2', text: 'Degrees (°)', correct: true, expl: 'Latitude and Longitude are angles measured in degrees (°), not linear distances like metres.' },
        { id: 'opt3', text: 'Kilometres (km)', correct: false, expl: 'GCS coordinates are always angular degrees (°).' },
      ],
    },
  ],
};

export const MISSION_4_SCENARIOS: ScenarioQuestion[] = [
  {
    id: 'scenario_1',
    title: 'Scenario 1: Global Climate Satellite Heatmap',
    context: 'NASA/MODIS satellite sea surface temperatures covering the entire globe.',
    scale: 'global',
    task: 'Which coordinate system is best suited for storing and exchanging this global dataset?',
    options: [
      {
        id: 'opt_gcs_wgs84',
        label: 'GCS: WGS 84 (EPSG:4326)',
        crsType: 'Geographic Coordinate System',
        epsg: 'EPSG:4326',
        isCorrect: true,
        explanation: 'Correct! For whole-world datasets and global satellite measurements, a Geographic Coordinate System (WGS 84) using degrees is standard because no single projected flat system covers the entire planet without extreme distortion.',
      },
      {
        id: 'opt_utm48',
        label: 'PCS: WGS 84 / UTM Zone 48N (EPSG:32648)',
        crsType: 'Projected Coordinate System',
        epsg: 'EPSG:32648',
        isCorrect: false,
        explanation: 'Incorrect. UTM Zone 48N is only valid for a 6° longitude strip (102°E–108°E). It cannot be used globally for worldwide satellite coverage!',
      },
      {
        id: 'opt_local_kertau',
        label: 'PCS: Kertau (RSO) Malaya (EPSG:3168)',
        crsType: 'National Projected System',
        epsg: 'EPSG:3168',
        isCorrect: false,
        explanation: 'Incorrect. Kertau RSO is a local projection tailored for Peninsular Malaysia, not for global satellite observations.',
      },
    ],
  },
  {
    id: 'scenario_2',
    title: 'Scenario 2: Melaka UTeM Campus Walking Distance & Area',
    context: 'The university facilities department needs to calculate walking distances (in metres) between faculty buildings and compute the precise square metres of new construction plots in Ayer Keroh, Melaka.',
    scale: 'local',
    task: 'Which coordinate system MUST be used to perform accurate distance and area calculations in metres?',
    options: [
      {
        id: 'opt_gcs_wgs84',
        label: 'GCS: WGS 84 (EPSG:4326) in Degrees',
        crsType: 'Geographic Coordinate System',
        epsg: 'EPSG:4326',
        isCorrect: false,
        explanation: 'Incorrect! GCS coordinates are in angular degrees (°). You cannot directly compute Euclidean distances or polygon areas in metres using degrees, because 1° of longitude shrinks as you move away from the Equator.',
      },
      {
        id: 'opt_utm48n',
        label: 'PCS: WGS 84 / UTM Zone 48N (EPSG:32648)',
        crsType: 'Projected Coordinate System',
        epsg: 'EPSG:32648',
        isCorrect: true,
        explanation: 'Correct! Melaka is located at 102.30°E, which falls inside UTM Zone 48N (102°E to 108°E). A PCS provides linear coordinates (Easting and Northing in metres), allowing precise distance and area calculations.',
      },
      {
        id: 'opt_utm47n',
        label: 'PCS: WGS 84 / UTM Zone 47N (EPSG:32647)',
        crsType: 'Projected Coordinate System',
        epsg: 'EPSG:32647',
        isCorrect: false,
        explanation: 'Incorrect. While UTM Zone 47N uses metres, Melaka (102.30°E) lies east of the 102°E meridian, so Zone 48N is the designated UTM zone for Melaka.',
      },
    ],
  },
  {
    id: 'scenario_3',
    title: 'Scenario 3: Peninsular Malaysia Highway Logistics Analysis',
    context: 'Analyzing a delivery route from Penang (approx. 100.33°E) through Kuala Lumpur (approx. 101.68°E) down to Melaka (approx. 102.30°E) and Johor Bahru (approx. 103.76°E).',
    scale: 'regional',
    task: 'Since Peninsular Malaysia spans both UTM Zone 47N and 48N, what does modern GIS software do to display both zones seamlessly on the same screen?',
    options: [
      {
        id: 'opt_otf',
        label: 'On-the-Fly CRS Transformation in the Map View',
        crsType: 'Dynamic Map Projection',
        epsg: 'Project CRS',
        isCorrect: true,
        explanation: 'Correct! Modern GIS tools (QGIS, ArcGIS) allow layers in different coordinate systems (e.g. Zone 47N and Zone 48N) to display together correctly through On-the-Fly (OTF) CRS transformation into the map project CRS.',
      },
      {
        id: 'opt_rename',
        label: 'Manually edit the .prj file text to say Zone 48N without math',
        crsType: 'Incorrect Technique',
        isCorrect: false,
        explanation: 'Dangerous mistake! Changing or editing the CRS definition without recalculating coordinate values causes severe misplacement! Assigning CRS is NOT reprojecting.',
      },
      {
        id: 'opt_degrees_only',
        label: 'GIS cannot show data from two different zones on one map',
        crsType: 'False Limitation',
        isCorrect: false,
        explanation: 'Incorrect. GIS engines routinely project different source layers into a unified map display coordinate system.',
      },
    ],
  },
  {
    id: 'scenario_4',
    title: 'Scenario 4: Web Basemap Integration (OpenStreetMap)',
    context: 'Publishing an interactive web dashboard for Melaka tourism using OpenStreetMap / Google Maps tiles in a web browser.',
    scale: 'global',
    task: 'Which projection is universally adopted by commercial and open-source web map tile slippy maps?',
    options: [
      {
        id: 'opt_webmercator',
        label: 'WGS 84 / Pseudo-Mercator (EPSG:3857)',
        crsType: 'Web Projected System',
        epsg: 'EPSG:3857',
        isCorrect: true,
        explanation: 'Correct! EPSG:3857 (Web Mercator) is the worldwide standard for web tile maps (Google Maps, OpenStreetMap, Mapbox, Bing). Data stored in EPSG:4326 or EPSG:32648 is transformed into EPSG:3857 for web rendering.',
      },
      {
        id: 'opt_polar',
        label: 'Universal Polar Stereographic (EPSG:32661)',
        crsType: 'Polar System',
        epsg: 'EPSG:32661',
        isCorrect: false,
        explanation: 'Incorrect. Polar stereographic is used for the Arctic / Antarctic regions, not equatorial web tiles.',
      },
    ],
  },
];

export const MISSION_5_BUGS: DetectiveBug[] = [
  {
    id: 'case_swapped_xy',
    title: 'Case #1: The Desert Island Mystery',
    symptom: 'The "Melaka School Points" layer appears far away in the ocean off the east coast of Africa / Somalia!',
    sampleCoords: 'X = 2.30, Y = 102.30 (in CSV: Latitude = 102.30, Longitude = 2.30)',
    layerCRS: 'WGS 84 (EPSG:4326)',
    mapCRS: 'WGS 84 (EPSG:4326)',
    mapVisualState: 'swapped_xy',
    diagnosticClues: [
      { step: 'Coordinate Values', observation: 'X is 2.30 and Y is 102.30' },
      { step: 'Allowed Latitude Range', observation: 'Latitude only ranges from -90° to +90°! 102.30° exceeds maximum possible latitude!' },
      { step: 'X / Y Order in GIS', observation: 'X must be Longitude (East-West), Y must be Latitude (North-South).' },
    ],
    question: 'Why are the Melaka school points displaying in the Indian Ocean near Somalia?',
    options: [
      {
        id: 'opt_swap',
        label: 'Latitude and Longitude are swapped (X and Y entered in wrong order)',
        isCorrect: true,
        technicalExplanation: 'BINGO! In GIS, X = Longitude (East-West) and Y = Latitude (North-South). The user assigned Latitude (2.30°N) to X and Longitude (102.30°E) to Y. Reversing X and Y brings all points instantly back to Melaka!',
      },
      {
        id: 'opt_datum',
        label: 'The datum is slightly shifted between WGS 84 and GDM2000',
        isCorrect: false,
        technicalExplanation: 'A datum shift only causes small offsets (a few metres to ~200 metres), never throwing data thousands of kilometres across an ocean!',
      },
      {
        id: 'opt_scale',
        label: 'The scale factor of the Transverse Mercator projection is corrupted',
        isCorrect: false,
        technicalExplanation: 'Scale factor adjustments affect local grid convergence, not hemisphere swaps.',
      },
    ],
  },
  {
    id: 'case_unit_mismatch',
    title: 'Case #2: The Microscopic Shrunk Point at Null Island',
    symptom: 'A surveyor sent UTM coordinates (X = 197450, Y = 248920 metres), but when loaded, GIS places them inside a tiny speck in the Atlantic Ocean near Ghana (0°, 0°)!',
    sampleCoords: 'Values: (197450, 248920) assigned to CRS EPSG:4326',
    layerCRS: 'Defined as WGS 84 (EPSG:4326 - Angular Degrees)',
    mapCRS: 'WGS 84 (EPSG:4326)',
    mapVisualState: 'degrees_as_metres',
    diagnosticClues: [
      { step: 'Coordinate Magnitude', observation: 'Values are in hundreds of thousands: 197,450 and 248,920' },
      { step: 'Unit Mismatch', observation: 'Layer CRS is set to EPSG:4326 which expects numbers between -180 and +180 DEGREES!' },
      { step: 'Symptom', observation: 'GIS clips or wraps 197,450 degrees, causing invalid spatial rendering at the origin!' },
    ],
    question: 'What is the root cause of this misplacement?',
    options: [
      {
        id: 'opt_units',
        label: 'Unit mismatch: UTM metre coordinates were wrongly defined as Geographic degrees (EPSG:4326)',
        isCorrect: true,
        technicalExplanation: 'Spot on! The raw numbers were Easting/Northing in metres from UTM Zone 48N, but during import, the user declared the layer as WGS 84 Degrees (EPSG:4326). Changing the assigned Layer CRS to EPSG:32648 (UTM Zone 48N) resolves it immediately!',
      },
      {
        id: 'opt_utm47',
        label: 'The data belongs to UTM Zone 47N instead of 48N',
        isCorrect: false,
        technicalExplanation: 'If it were just the wrong zone, the points would appear ~600 km to the west or east in Peninsular Malaysia/Sumatra, not broken at 0,0.',
      },
      {
        id: 'opt_corrupt',
        label: 'The CSV coordinates were corrupted during file download',
        isCorrect: false,
        technicalExplanation: 'The numbers 197450 and 248920 are valid UTM Zone 48N coordinates for Melaka.',
      },
    ],
  },
  {
    id: 'case_datum_offset',
    title: 'Case #3: The Sub-Kilometre Cadastral Shift',
    symptom: 'School fence parcels in Melaka are parallel to road basemaps but offset by approximately 15 to 20 metres into the adjacent river.',
    sampleCoords: 'Measured points: ~20m consistent systematic shift across all landmarks',
    layerCRS: 'GDM2000 / UTM Zone 48N (Malaysian National Datum)',
    mapCRS: 'WGS 84 / UTM Zone 48N (Global GPS Datum)',
    mapVisualState: 'datum_shift',
    diagnosticClues: [
      { step: 'Offset Nature', observation: 'Every single point is uniformly shifted by a small distance (~15–20m)' },
      { step: 'Datums Involved', observation: 'One layer uses GDM2000 (Malaysian Geocentric Datum) while the basemap uses WGS 84' },
      { step: 'Solution', observation: 'Apply a Datum Transformation between GDM2000 and WGS 84' },
    ],
    question: 'How should a professional GIS specialist resolve this subtle systematic shift?',
    options: [
      {
        id: 'opt_transform',
        label: 'Configure a Geographic / Datum Transformation between GDM2000 and WGS 84',
        isCorrect: true,
        technicalExplanation: 'Exactly! Different datums use slightly different Earth reference ellipsoids or origin shifts. A formal datum transformation mathematically bridges the two reference frames so features align perfectly.',
      },
      {
        id: 'opt_drag',
        label: 'Manually select all points with the edit tool and drag them by eye',
        isCorrect: false,
        technicalExplanation: 'Never drag spatial survey points by eye! That destroys legal survey accuracy and coordinate integrity.',
      },
      {
        id: 'opt_retype',
        label: 'Delete the shapefile and re-digitize manually from Google Earth',
        isCorrect: false,
        technicalExplanation: 'Unscientific and inaccurate. Datum transformation is the mathematically correct solution.',
      },
    ],
  },
];

export const GIS_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    name: 'Get the Coordinates',
    shortDesc: 'Acquire survey CSV with Easting (X) & Northing (Y) or Lat/Long from GPS or open data.',
    category: 'input',
    icon: 'FileSpreadsheet',
  },
  {
    id: 2,
    name: 'Choose Coordinate System',
    shortDesc: 'Identify the study area and required units. For Melaka local mapping: UTM Zone 48N (WGS 84).',
    category: 'crs',
    icon: 'Compass',
  },
  {
    id: 3,
    name: 'Import & Prepare Data',
    shortDesc: 'In GIS (QGIS/ArcGIS), use "Add XY Data", map X to Easting, Y to Northing, set CRS.',
    category: 'import',
    icon: 'Database',
  },
  {
    id: 4,
    name: 'Check the Results',
    shortDesc: 'Inspect points: Are they inside the Melaka boundary? Validate coordinates, units, and orientation.',
    category: 'qa',
    icon: 'CheckCircle2',
  },
  {
    id: 5,
    name: 'Overlay with Other Layers',
    shortDesc: 'Combine points with Melaka boundary, road network, and rivers using on-the-fly CRS reprojection.',
    category: 'overlay',
    icon: 'Layers',
  },
  {
    id: 6,
    name: 'Final Spatially Accurate Map',
    shortDesc: 'Export polished cartographic output ready for spatial analysis and university decision-making.',
    category: 'output',
    icon: 'Map',
  },
];
