import React, { useState, useEffect } from 'react';
import { Building2, Database, FileCheck, AlertCircle, CheckCircle, Download, Activity, AlertTriangle, GitBranch, Server, RefreshCw, Zap, BarChart3, Upload, FileText, Wrench, ArrowRight, Cpu, Clock, Users, TrendingDown, Leaf, DollarSign, Gauge } from 'lucide-react';
import EEDAudit from './EEDAudit';
import './heatcert.css';

const CompliancePlatform = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [uploadStep, setUploadStep] = useState('upload'); // upload, preview, validate, calculate, complete
  const [validationProgress, setValidationProgress] = useState(0);
  const [validatedIssues, setValidatedIssues] = useState([]);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [calculatedMetrics, setCalculatedMetrics] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const facilities = [
    { 
      id: 'dc-oslo-1', 
      name: 'Oslo DC1', 
      location: 'Oslo, Norway',
      capacity: '5MW',
      pue: 1.32,
      integrationStatus: 'connected',
      bmsSystem: 'Schneider StruxureWare',
      lastSync: '2 min ago',
      complianceScore: 98,
      dataPoints: 35040,
      validationErrors: 12,
      apiLatency: '45ms',
      issuesFixed: 847
    },
    { 
      id: 'dc-stockholm-1', 
      name: 'Stockholm DC1', 
      location: 'Stockholm, Sweden',
      capacity: '8MW',
      pue: 1.28,
      integrationStatus: 'connected',
      bmsSystem: 'Johnson Metasys',
      lastSync: '5 min ago',
      complianceScore: 95,
      dataPoints: 35040,
      validationErrors: 18,
      apiLatency: '62ms',
      issuesFixed: 1243
    },
    { 
      id: 'dc-copenhagen-1', 
      name: 'Copenhagen DC1', 
      location: 'Copenhagen, Denmark',
      capacity: '3MW',
      pue: 1.45,
      integrationStatus: 'degraded',
      bmsSystem: 'Vertiv Environet',
      lastSync: '1 hour ago',
      complianceScore: 87,
      dataPoints: 34980,
      validationErrors: 142,
      apiLatency: '320ms',
      issuesFixed: 2156
    }
  ];

  const rawDataPreview = `Timestamp,IT_Load_kW,Total_Power_kW,Cooling_Power_kW,Outside_Temp_C,Water_Consumption_L
2025-01-15 00:00:00,4523.2,5986.4,1463.2,12.3,847
2025-01-15 00:15:00,4489.1,,1452.8,12.1,851
2025-01-15 00:30:00,4512.7,5974.3,1461.6,12.0,849
2025-01-15 00:45:00,4498.3,5963.1,1464.8,11.8,853
2025-01-15 01:00:00,4501.9,5951.7,1449.8,11.7,846
2025-01-15 01:15:00,4487.2,5944.2,1457.0,11.5,null
2025-01-15 01:30:00,4523.8,5988.9,1465.1,11.4,848
2025-01-15 01:45:00,-4519.6,5979.2,1459.6,11.2,850
2025-01-15 02:00:00,4506.4,5967.8,1461.4,11.1,847`;

  const validationIssues = [
    { 
      line: 3, 
      field: 'Total_Power_kW', 
      issue: 'Missing value', 
      original: 'null',
      corrected: '5965.9 kW',
      method: 'Linear interpolation from adjacent readings',
      standard: 'ASHRAE Guideline 14-2014'
    },
    { 
      line: 7, 
      field: 'Water_Consumption_L', 
      issue: 'Missing value', 
      original: 'null',
      corrected: '847 L',
      method: 'Mean of surrounding 4 data points',
      standard: 'IPMVP Core Concepts 2022'
    },
    { 
      line: 9, 
      field: 'IT_Load_kW', 
      issue: 'Invalid sign (negative)', 
      original: '-4519.6 kW',
      corrected: '4519.6 kW',
      method: 'Sign correction applied',
      standard: 'CEN/CENELEC EN 50600-4-2'
    },
    { 
      line: 0, 
      field: 'All timestamps', 
      issue: 'Timezone validation', 
      original: 'Local time',
      corrected: 'UTC normalized',
      method: 'Converted to UTC+0',
      standard: 'EU Regulation 2024/1364 Annex II'
    },
  ];

  const calculationMetrics = [
    {
      name: 'Power Usage Effectiveness (PUE)',
      formula: 'EDC / EIT',
      value: '1.32',
      status: 'compliant',
      threshold: '≤ 1.5',
      standard: 'CEN/CENELEC EN 50600-4-2',
      regulation: 'EU Regulation 2024/1364 Annex III(a)',
      description: 'Ratio of total facility energy to IT equipment energy'
    },
    {
      name: 'Water Usage Effectiveness (WUE)',
      formula: 'WIN / EIT',
      value: '0.92 L/kWh',
      status: 'compliant',
      threshold: 'Best practice',
      standard: 'CEN/CENELEC EN 50600-4-9',
      regulation: 'EU Regulation 2024/1364 Annex III(b)',
      description: 'Annual water usage divided by IT equipment energy'
    },
    {
      name: 'Energy Reuse Factor (ERF)',
      formula: 'EREUSE / EDC',
      value: '22%',
      status: 'compliant',
      threshold: 'District heating integration',
      standard: 'CEN/CENELEC EN 50600-4-6',
      regulation: 'EU Regulation 2024/1364 Annex III(c)',
      description: 'Waste heat reused outside data center boundary'
    },
    {
      name: 'Renewable Energy Factor (REF)',
      formula: 'ERES-TOT / EDC',
      value: '91%',
      status: 'compliant',
      threshold: '≥ 80%',
      standard: 'CEN/CENELEC EN 50600-4-3',
      regulation: 'EU Regulation 2024/1364 Annex III(d)',
      description: 'Total renewable energy consumption ratio'
    },
  ];

  const gpuFleet = [
    { facility: 'Oslo DC1', gpuType: 'NVIDIA H100 SXM', count: 512, utilization: 94, powerDraw: 3412, maxPower: 3584, tempAvg: 68 },
    { facility: 'Stockholm DC1', gpuType: 'NVIDIA H100 SXM', count: 1024, gpuTypeSecondary: 'NVIDIA A100 80GB', countSecondary: 256, utilization: 89, powerDraw: 6248, maxPower: 7372, tempAvg: 71 },
    { facility: 'Copenhagen DC1', gpuType: 'NVIDIA A100 80GB', count: 384, utilization: 78, powerDraw: 1843, maxPower: 2304, tempAvg: 65 },
  ];

  const trainingJobs = [
    { id: 'job-001', name: 'LLaMA-3.2-70B Fine-tune', customer: 'NeuralTech AI', facility: 'Stockholm DC1', gpus: 128, gpuType: 'H100', status: 'running', progress: 67, energyKwh: 4823, durationHrs: 18.4, estimatedCost: 1687, carbonKg: 1013, batchSize: 2048, powerLimit: '90%', zeusOptimized: true, savingsPercent: 23 },
    { id: 'job-002', name: 'Whisper-v4 Training', customer: 'VoiceScale Inc', facility: 'Oslo DC1', gpus: 64, gpuType: 'H100', status: 'running', progress: 34, energyKwh: 1247, durationHrs: 6.2, estimatedCost: 436, carbonKg: 262, batchSize: 512, powerLimit: '85%', zeusOptimized: true, savingsPercent: 31 },
    { id: 'job-003', name: 'Stable Diffusion XL v3', customer: 'GenArt Studios', facility: 'Stockholm DC1', gpus: 256, gpuType: 'H100', status: 'running', progress: 89, energyKwh: 12480, durationHrs: 52.1, estimatedCost: 4368, carbonKg: 2621, batchSize: 4096, powerLimit: '95%', zeusOptimized: false, savingsPercent: 0 },
    { id: 'job-004', name: 'CodeGen-15B Pretraining', customer: 'DevAssist Corp', facility: 'Oslo DC1', gpus: 32, gpuType: 'H100', status: 'running', progress: 12, energyKwh: 389, durationHrs: 2.8, estimatedCost: 136, carbonKg: 82, batchSize: 1024, powerLimit: '80%', zeusOptimized: true, savingsPercent: 28 },
    { id: 'job-005', name: 'Climate Model v2', customer: 'EarthSim Research', facility: 'Copenhagen DC1', gpus: 96, gpuType: 'A100', status: 'running', progress: 56, energyKwh: 2156, durationHrs: 14.7, estimatedCost: 755, carbonKg: 453, batchSize: 768, powerLimit: '85%', zeusOptimized: true, savingsPercent: 19 },
    { id: 'job-006', name: 'Protein Fold Prediction', customer: 'BioCompute Ltd', facility: 'Copenhagen DC1', gpus: 48, gpuType: 'A100', status: 'queued', progress: 0, energyKwh: 0, durationHrs: 0, estimatedCost: 0, carbonKg: 0, batchSize: 256, powerLimit: '90%', zeusOptimized: true, savingsPercent: 0 },
  ];

  const customerAttribution = [
    { name: 'NeuralTech AI', gpuHours: 2355, energyKwh: 4823, carbonKg: 1013, cost: 1687, jobs: 1, facility: 'Stockholm DC1' },
    { name: 'GenArt Studios', gpuHours: 13338, energyKwh: 12480, carbonKg: 2621, cost: 4368, jobs: 1, facility: 'Stockholm DC1' },
    { name: 'VoiceScale Inc', gpuHours: 397, energyKwh: 1247, carbonKg: 262, cost: 436, jobs: 1, facility: 'Oslo DC1' },
    { name: 'EarthSim Research', gpuHours: 1411, energyKwh: 2156, carbonKg: 453, cost: 755, jobs: 1, facility: 'Copenhagen DC1' },
    { name: 'DevAssist Corp', gpuHours: 90, energyKwh: 389, carbonKg: 82, cost: 136, jobs: 1, facility: 'Oslo DC1' },
    { name: 'BioCompute Ltd', gpuHours: 0, energyKwh: 0, carbonKg: 0, cost: 0, jobs: 1, facility: 'Copenhagen DC1' },
  ];

  const zeusOptimizations = [
    { job: 'LLaMA-3.2-70B Fine-tune', type: 'Batch Size', original: '1024', optimized: '2048', energySaved: '23%', method: 'Zeus BatchSizeOptimizer — JKNL cost model' },
    { job: 'Whisper-v4 Training', type: 'Power Limit', original: '700W', optimized: '595W (85%)', energySaved: '31%', method: 'Zeus GlobalPowerLimitOptimizer — Pareto frontier' },
    { job: 'CodeGen-15B Pretraining', type: 'Power Limit + Batch Size', original: '700W / BS 512', optimized: '560W / BS 1024', energySaved: '28%', method: 'Zeus combined optimization — Perseus pipeline frequency' },
    { job: 'Climate Model v2', type: 'Pipeline Frequency', original: 'Default freq', optimized: 'Perseus-optimized', energySaved: '19%', method: 'Zeus PipelineFrequencyOptimizer — per-stage tuning' },
  ];

  useEffect(() => {
    if (uploadStep === 'validate' && validationProgress < 100) {
      const timer = setTimeout(() => {
        const newProgress = Math.min(validationProgress + 2, 100);
        setValidationProgress(newProgress);
        
        if (newProgress >= 25 && validatedIssues.length === 0) {
          setValidatedIssues([validationIssues[0]]);
        } else if (newProgress >= 50 && validatedIssues.length === 1) {
          setValidatedIssues([validationIssues[0], validationIssues[1]]);
        } else if (newProgress >= 75 && validatedIssues.length === 2) {
          setValidatedIssues([validationIssues[0], validationIssues[1], validationIssues[2]]);
        } else if (newProgress >= 100 && validatedIssues.length === 3) {
          setValidatedIssues(validationIssues);
          setTimeout(() => setUploadStep('calculate'), 800);
        }
      }, 150);
      
      return () => clearTimeout(timer);
    }

    if (uploadStep === 'calculate' && calculationProgress < 100) {
      const timer = setTimeout(() => {
        const newProgress = Math.min(calculationProgress + 2, 100);
        setCalculationProgress(newProgress);
        
        if (newProgress >= 25 && calculatedMetrics.length === 0) {
          setCalculatedMetrics([calculationMetrics[0]]);
        } else if (newProgress >= 50 && calculatedMetrics.length === 1) {
          setCalculatedMetrics([calculationMetrics[0], calculationMetrics[1]]);
        } else if (newProgress >= 75 && calculatedMetrics.length === 2) {
          setCalculatedMetrics([calculationMetrics[0], calculationMetrics[1], calculationMetrics[2]]);
        } else if (newProgress >= 100 && calculatedMetrics.length === 3) {
          setCalculatedMetrics(calculationMetrics);
          setTimeout(() => setUploadStep('complete'), 800);
        }
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [uploadStep, validationProgress, validatedIssues.length, calculationProgress, calculatedMetrics.length]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessingFile(true);
      
      // Simulate a brief processing delay for realism
      setTimeout(() => {
        setIsProcessingFile(false);
        setUploadStep('preview');
      }, 800);
    }
  };

  const handleFileUpload = () => {
    document.getElementById('file-input').click();
  };

  const startValidation = () => {
    setUploadStep('validate');
    setValidationProgress(0);
    setValidatedIssues([]);
    setCalculationProgress(0);
    setCalculatedMetrics([]);
  };

  const generateComprehensiveReport = () => {
    const reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>EU Data Center Compliance Report - Q4 2025</title>
  <style>
    @page { margin: 2cm; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 21cm;
      margin: 0 auto;
      padding: 20px;
    }
    .header { 
      border-bottom: 3px solid #000; 
      padding-bottom: 20px; 
      margin-bottom: 40px;
    }
    .header h1 { 
      margin: 0 0 10px 0; 
      font-size: 28px;
      font-weight: 600;
    }
    .header-info { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 10px;
      margin-top: 15px;
      font-size: 14px;
    }
    .header-info div { 
      padding: 8px;
      background: #f5f5f5;
      border-left: 3px solid #000;
    }
    .header-info strong { 
      display: block; 
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
      margin-bottom: 3px;
    }
    .section { 
      margin: 40px 0;
      page-break-inside: avoid;
    }
    .section h2 { 
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 10px;
    }
    .metrics { 
      display: grid; 
      grid-template-columns: repeat(4, 1fr); 
      gap: 15px; 
      margin: 20px 0;
    }
    .metric { 
      border: 1px solid #e0e0e0; 
      padding: 20px;
      background: #fafafa;
      text-align: center;
    }
    .metric-label { 
      font-size: 11px;
      text-transform: uppercase;
      color: #666;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .metric-value { 
      font-size: 32px;
      font-weight: 300;
      margin: 5px 0;
    }
    .metric-change { 
      font-size: 12px;
      color: #666;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0;
      font-size: 13px;
    }
    th, td { 
      border: 1px solid #e0e0e0; 
      padding: 12px; 
      text-align: left;
    }
    th { 
      background: #f5f5f5;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    tr:nth-child(even) { 
      background: #fafafa;
    }
    .compliance-item {
      display: flex;
      align-items: center;
      padding: 12px;
      border: 1px solid #e0e0e0;
      margin-bottom: 8px;
      background: white;
    }
    .compliance-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #000;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      font-size: 14px;
    }
    .data-quality {
      background: #f9f9f9;
      border-left: 4px solid #000;
      padding: 20px;
      margin: 20px 0;
    }
    .data-quality h3 {
      margin-top: 0;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .quality-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 15px;
    }
    .quality-item {
      background: white;
      padding: 12px;
      border: 1px solid #e0e0e0;
    }
    .quality-item strong {
      display: block;
      font-size: 20px;
      margin-bottom: 5px;
    }
    .quality-item span {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
    }
    .certification { 
      margin-top: 50px; 
      padding: 25px; 
      background: #f5f5f5; 
      border-left: 4px solid #000;
    }
    .certification strong { 
      display: block;
      margin-bottom: 10px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .signature-block {
      margin-top: 60px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    .signature {
      border-top: 2px solid #000;
      padding-top: 10px;
    }
    .signature-name {
      font-weight: 600;
      margin-bottom: 5px;
    }
    .signature-title {
      font-size: 12px;
      color: #666;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      font-size: 11px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>EU Data Center Compliance Report</h1>
    <div class="header-info">
      <div>
        <strong>Organization</strong>
        Oslo Data Centers AS
      </div>
      <div>
        <strong>Reporting Period</strong>
        Q4 2025 (October - December)
      </div>
      <div>
        <strong>Report Generated</strong>
        ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
      </div>
      <div>
        <strong>Report ID</strong>
        ODC-2025-Q4-847293
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <p>This report presents the environmental performance and compliance status of Oslo Data Centers AS for the reporting period Q4 2025. All facilities have been assessed against EU Taxonomy Regulation 2020/852 and the Energy Efficiency Directive (EU) 2023/1791.</p>
    
    <div class="metrics">
      <div class="metric">
        <div class="metric-label">Average PUE</div>
        <div class="metric-value">1.35</div>
        <div class="metric-change">-8.2% YoY</div>
      </div>
      <div class="metric">
        <div class="metric-label">Renewable Energy</div>
        <div class="metric-value">91%</div>
        <div class="metric-change">+6% YoY</div>
      </div>
      <div class="metric">
        <div class="metric-label">Water Usage</div>
        <div class="metric-value">0.92</div>
        <div class="metric-change">WUE -3.2% YoY</div>
      </div>
      <div class="metric">
        <div class="metric-label">Carbon Intensity</div>
        <div class="metric-value">0.21</div>
        <div class="metric-change">kgCO₂/kWh</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Facility Performance Details</h2>
    <table>
      <thead>
        <tr>
          <th>Facility</th>
          <th>Location</th>
          <th>Capacity</th>
          <th>PUE</th>
          <th>WUE</th>
          <th>REF (%)</th>
          <th>ERF (%)</th>
          <th>Compliance</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Oslo DC1</strong></td>
          <td>Oslo, Norway</td>
          <td>5 MW</td>
          <td>1.32</td>
          <td>0.92</td>
          <td>91%</td>
          <td>22%</td>
          <td>98%</td>
        </tr>
        <tr>
          <td><strong>Stockholm DC1</strong></td>
          <td>Stockholm, Sweden</td>
          <td>8 MW</td>
          <td>1.28</td>
          <td>0.89</td>
          <td>94%</td>
          <td>25%</td>
          <td>95%</td>
        </tr>
        <tr>
          <td><strong>Copenhagen DC1</strong></td>
          <td>Copenhagen, Denmark</td>
          <td>3 MW</td>
          <td>1.45</td>
          <td>0.95</td>
          <td>87%</td>
          <td>18%</td>
          <td>87%</td>
        </tr>
        <tr style="background: #f0f0f0; font-weight: 600;">
          <td colspan="3"><strong>Portfolio Average</strong></td>
          <td>1.35</td>
          <td>0.92</td>
          <td>91%</td>
          <td>22%</td>
          <td>93%</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>EU Taxonomy Compliance Status</h2>
    
    <div class="compliance-item">
      <div class="compliance-icon">✓</div>
      <div style="flex: 1;">
        <strong>Power Usage Effectiveness (PUE)</strong>
        <div style="font-size: 12px; color: #666;">Annual average: 1.35 | Target: ≤1.5 | Status: Compliant</div>
      </div>
    </div>

    <div class="compliance-item">
      <div class="compliance-icon">✓</div>
      <div style="flex: 1;">
        <strong>Renewable Energy Factor (REF)</strong>
        <div style="font-size: 12px; color: #666;">Portfolio average: 91% | Target: ≥80% | Status: Compliant</div>
      </div>
    </div>

    <div class="compliance-item">
      <div class="compliance-icon">✓</div>
      <div style="flex: 1;">
        <strong>Water Usage Effectiveness (WUE)</strong>
        <div style="font-size: 12px; color: #666;">Portfolio average: 0.92 L/kWh | Best practice achieved</div>
      </div>
    </div>

    <div class="compliance-item">
      <div class="compliance-icon">✓</div>
      <div style="flex: 1;">
        <strong>Energy Reuse Factor (ERF)</strong>
        <div style="font-size: 12px; color: #666;">Waste heat recovery: 22% | District heating integration active</div>
      </div>
    </div>

    <div class="compliance-item">
      <div class="compliance-icon">✓</div>
      <div style="flex: 1;">
        <strong>Environmental Management System</strong>
        <div style="font-size: 12px; color: #666;">ISO 14001:2015 certified | Annual audit completed October 2025</div>
      </div>
    </div>

    <div class="compliance-item">
      <div class="compliance-icon">✓</div>
      <div style="flex: 1;">
        <strong>GHG Emissions Reporting</strong>
        <div style="font-size: 12px; color: #666;">Scope 1, 2, 3 reported | Aligned with GHG Protocol Corporate Standard</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Historical Performance (5-Year Trend)</h2>
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th>2021</th>
          <th>2022</th>
          <th>2023</th>
          <th>2024</th>
          <th>2025</th>
          <th>5Y Change</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>PUE</strong></td>
          <td>1.52</td>
          <td>1.45</td>
          <td>1.38</td>
          <td>1.35</td>
          <td>1.32</td>
          <td style="color: #2d7d2d; font-weight: 600;">-13.2%</td>
        </tr>
        <tr>
          <td><strong>WUE (L/kWh)</strong></td>
          <td>1.20</td>
          <td>1.10</td>
          <td>0.98</td>
          <td>0.95</td>
          <td>0.92</td>
          <td style="color: #2d7d2d; font-weight: 600;">-23.3%</td>
        </tr>
        <tr>
          <td><strong>REF (%)</strong></td>
          <td>45%</td>
          <td>58%</td>
          <td>72%</td>
          <td>85%</td>
          <td>91%</td>
          <td style="color: #2d7d2d; font-weight: 600;">+102%</td>
        </tr>
        <tr>
          <td><strong>Carbon Intensity</strong></td>
          <td>0.42</td>
          <td>0.38</td>
          <td>0.31</td>
          <td>0.25</td>
          <td>0.21</td>
          <td style="color: #2d7d2d; font-weight: 600;">-50%</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="data-quality">
    <h3>Data Quality & Validation</h3>
    <p style="margin-bottom: 15px;">All data in this report has been validated using automated quality assurance processes compliant with ASHRAE Guideline 14 and IPMVP protocols.</p>
    
    <div class="quality-grid">
      <div class="quality-item">
        <strong>105,120</strong>
        <span>Total Data Points</span>
      </div>
      <div class="quality-item">
        <strong>99.2%</strong>
        <span>Data Quality Score</span>
      </div>
      <div class="quality-item">
        <strong>847</strong>
        <span>Validation Rules Applied</span>
      </div>
      <div class="quality-item">
        <strong>172</strong>
        <span>Issues Auto-Corrected</span>
      </div>
      <div class="quality-item">
        <strong>4</strong>
        <span>Manual Reviews</span>
      </div>
      <div class="quality-item">
        <strong>100%</strong>
        <span>Audit Trail Coverage</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Greenhouse Gas Emissions</h2>
    <table>
      <thead>
        <tr>
          <th>Scope</th>
          <th>Source</th>
          <th>Emissions (tCO₂e)</th>
          <th>% of Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Scope 1</strong></td>
          <td>Backup generators, refrigerants</td>
          <td>142</td>
          <td>3.2%</td>
        </tr>
        <tr>
          <td><strong>Scope 2 (Location)</strong></td>
          <td>Grid electricity</td>
          <td>892</td>
          <td>20.1%</td>
        </tr>
        <tr>
          <td><strong>Scope 2 (Market)</strong></td>
          <td>Grid electricity (renewable contracts)</td>
          <td>78</td>
          <td>1.8%</td>
        </tr>
        <tr>
          <td><strong>Scope 3</strong></td>
          <td>Supply chain, business travel, waste</td>
          <td>3,324</td>
          <td>75.0%</td>
        </tr>
        <tr style="background: #f0f0f0; font-weight: 600;">
          <td colspan="2"><strong>Total Emissions</strong></td>
          <td>4,436</td>
          <td>100%</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="certification">
    <strong>Compliance Certification</strong>
    <p style="margin: 0;">This report has been prepared in accordance with:</p>
    <ul style="margin: 10px 0; padding-left: 20px;">
      <li>EU Taxonomy Regulation 2020/852, Delegated Act on Climate</li>
      <li>Energy Efficiency Directive (EU) 2023/1791</li>
      <li>CSRD - Corporate Sustainability Reporting Directive</li>
      <li>ISO 14064-3:2019 - GHG emissions verification</li>
      <li>ASHRAE Guideline 14-2014 - Measurement of energy demand</li>
      <li>IPMVP Core Concepts 2022</li>
    </ul>
    <p style="margin-top: 15px; font-size: 12px;">Data validation completed: ${new Date().toLocaleDateString('en-GB')} | Quality score: 99.2% | Validation framework: v2.1.4</p>
  </div>

  <div class="signature-block">
    <div class="signature">
      <div class="signature-name">Lars Andersen</div>
      <div class="signature-title">Chief Sustainability Officer</div>
      <div class="signature-title">Oslo Data Centers AS</div>
    </div>
    <div class="signature">
      <div class="signature-name">Dr. Emma Svensson</div>
      <div class="signature-title">Independent Verifier</div>
      <div class="signature-title">Nordic ESG Certification Ltd.</div>
    </div>
  </div>

  <div class="footer">
    <p>This document is generated by an automated compliance platform and has been validated against EU regulatory requirements.</p>
    <p>Oslo Data Centers AS | Org.nr: 987 654 321 | contact@oslodatacenters.no | +47 22 12 34 56</p>
    <p style="margin-top: 10px;">© 2025 Oslo Data Centers AS. All rights reserved. | Page 1 of 1</p>
  </div>
</body>
</html>
    `;

    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EU_Compliance_Report_Q4_2025_${new Date().getTime()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const UploadFlow = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Process Facility Data</h2>
          <button 
            onClick={() => {
              setShowUploadFlow(false);
              setUploadStep('upload');
              setValidationProgress(0);
              setValidatedIssues([]);
              setCalculationProgress(0);
              setCalculatedMetrics([]);
              setUploadedFile(null);
              setIsProcessingFile(false);
            }} 
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Upload Step */}
        {uploadStep === 'upload' && (
          <div className="p-8">
            <input
              id="file-input"
              type="file"
              accept=".csv,.xlsx,.xls,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50"
              onClick={handleFileUpload}
            >
              {isProcessingFile ? (
                <>
                  <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-base font-medium text-gray-900 mb-2">Processing File...</p>
                  <p className="text-sm text-gray-500">Reading and parsing data</p>
                </>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-base font-medium text-gray-900 mb-2">Upload Facility Data</p>
                  <p className="text-sm text-gray-500 mb-4">CSV or Excel files from BMS exports</p>
                  <button className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors">
                    Select File
                  </button>
                </>
              )}
            </div>
            <div className="mt-6 text-xs text-gray-500 text-center">
              Supports: Schneider StruxureWare, Johnson Metasys, Vertiv Environet formats
            </div>
          </div>
        )}

        {/* Preview Step */}
        {uploadStep === 'preview' && (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    {uploadedFile ? uploadedFile.name : 'facility_data_jan2025.csv'}
                  </div>
                  <div className="text-xs text-gray-500">
                    2,847 rows • 6 columns • {uploadedFile ? `${(uploadedFile.size / 1024).toFixed(0)} KB` : '847 KB'}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-gray-300 font-mono whitespace-pre">{rawDataPreview}</pre>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="text-sm font-medium text-gray-900 mb-2">Data Summary</div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-gray-500 mb-1">Time Range</div>
                  <div className="text-gray-900">Jan 15, 00:00 - Jan 31, 23:45</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Sampling Rate</div>
                  <div className="text-gray-900">15-minute intervals</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Data Points</div>
                  <div className="text-gray-900">2,847 total</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setUploadStep('upload');
                  setUploadedFile(null);
                }}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={startValidation}
                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Run Validation
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Validation Step */}
        {uploadStep === 'validate' && (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">Data Quality Validation</span>
                <span className="text-sm text-gray-600">{validationProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${validationProgress}%` }}
                ></div>
              </div>
              <div className="mt-3 text-xs text-gray-500 space-y-1">
                <div>Running 847 validation rules across multiple standards</div>
                <div className="grid grid-cols-2 gap-2 mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <span>ASHRAE Guideline 14-2014</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <span>CEN/CENELEC EN 50600 Series</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <span>IPMVP Core Concepts 2022</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    <span>EU Regulation 2024/1364</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {validatedIssues.map((issue, idx) => (
                <div 
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 bg-white"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {issue.field} {issue.line > 0 ? `(Line ${issue.line})` : ''}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{issue.issue}</span>
                  </div>
                  <div className="ml-6 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-gray-500 mb-1">Original</div>
                      <div className="font-mono text-gray-700 line-through">{issue.original}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Corrected</div>
                      <div className="font-mono text-gray-900 font-medium">{issue.corrected}</div>
                    </div>
                  </div>
                  <div className="ml-6 mt-3 pt-3 border-t border-gray-100 text-xs">
                    <div className="flex items-start gap-2 text-gray-600 mb-1">
                      <span className="font-medium">Method:</span>
                      <span>{issue.method}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-500">
                      <span className="font-medium">Standard:</span>
                      <span>{issue.standard}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calculation Step */}
        {uploadStep === 'calculate' && (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">Computing EU Compliance Metrics</span>
                <span className="text-sm text-gray-600">{calculationProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculationProgress}%` }}
                ></div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Calculating sustainability indicators per EU Regulation 2024/1364 Annex III
              </div>
            </div>

            <div className="space-y-3">
              {calculatedMetrics.map((metric, idx) => (
                <div 
                  key={idx}
                  className="border border-gray-200 rounded-lg p-5 bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-900">{metric.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 ml-6">{metric.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-medium text-gray-900">{metric.value}</div>
                      <div className="text-xs text-gray-500">{metric.status === 'compliant' ? '✓ Compliant' : 'Review'}</div>
                    </div>
                  </div>
                  
                  <div className="ml-6 space-y-2">
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-gray-500 mb-1">Formula</div>
                          <div className="font-mono text-gray-900 font-medium">{metric.formula}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Threshold</div>
                          <div className="font-mono text-gray-900 font-medium">{metric.threshold}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                      <div className="flex items-start gap-2 text-gray-600">
                        <FileText className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium mb-0.5">Standard</div>
                          <div className="text-gray-500">{metric.standard}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <FileCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium mb-0.5">Regulation</div>
                          <div className="text-gray-500">{metric.regulation}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {calculatedMetrics.length === calculationMetrics.length && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                <div className="font-medium text-gray-900 mb-2">Cross-standard Validation Complete</div>
                <div className="space-y-1">
                  <div>✓ All metrics comply with EU Taxonomy Regulation 2020/852</div>
                  <div>✓ CSRD reporting requirements satisfied</div>
                  <div>✓ ISO 14064-3:2019 GHG verification aligned</div>
                  <div>✓ Ready for European database submission</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Complete Step */}
        {uploadStep === 'complete' && (
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Complete</h3>
              <p className="text-sm text-gray-600">Dataset validated and EU compliance metrics calculated</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">2,847</div>
                <div className="text-xs text-gray-500">Data Points</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">{validatedIssues.length}</div>
                <div className="text-xs text-gray-500">Issues Fixed</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">{calculatedMetrics.length}</div>
                <div className="text-xs text-gray-500">Metrics Calculated</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">99.8%</div>
                <div className="text-xs text-gray-500">Quality Score</div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
              <div className="text-sm font-medium text-gray-900 mb-4">Validation & Calculation Summary</div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Data Quality Issues Resolved:</div>
                  <div className="space-y-3 ml-3">
                    {validatedIssues.map((issue, idx) => (
                      <div key={idx} className="border-l-2 border-gray-300 pl-3 py-1">
                        <div className="flex items-start gap-2 mb-1">
                          <CheckCircle className="w-3 h-3 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-900 mb-1">
                              {issue.field} {issue.line > 0 ? `(Line ${issue.line})` : ''}: {issue.issue}
                            </div>
                            <div className="text-xs text-gray-600 space-y-0.5">
                              <div className="flex gap-2">
                                <span className="text-gray-500 font-medium">Original:</span>
                                <span className="font-mono line-through">{issue.original}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-gray-500 font-medium">Corrected:</span>
                                <span className="font-mono text-gray-900">{issue.corrected}</span>
                              </div>
                              <div className="flex gap-2 mt-1">
                                <span className="text-gray-500 font-medium">Method:</span>
                                <span className="text-gray-700">{issue.method}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-gray-500 font-medium">Standard:</span>
                                <span className="text-gray-600 text-[10px]">{issue.standard}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-xs font-medium text-gray-700 mb-2">EU Compliance Metrics Calculated:</div>
                  <div className="grid grid-cols-2 gap-3 ml-3">
                    {calculatedMetrics.map((metric, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-3 h-3 text-gray-600" />
                          <span className="font-medium text-gray-900">{metric.name}</span>
                        </div>
                        <div className="ml-5 text-gray-600">
                          <div>{metric.value} (Target: {metric.threshold})</div>
                          <div className="text-gray-500">{metric.standard}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-xs font-medium text-gray-700 mb-2">Standards Applied:</div>
                  <div className="grid grid-cols-2 gap-2 ml-3 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      <span>CEN/CENELEC EN 50600-4-2 (PUE)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      <span>CEN/CENELEC EN 50600-4-9 (WUE)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      <span>CEN/CENELEC EN 50600-4-6 (ERF)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      <span>CEN/CENELEC EN 50600-4-3 (REF)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      <span>ASHRAE Guideline 14-2014</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      <span>IPMVP Core Concepts 2022</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                generateComprehensiveReport();
                setShowUploadFlow(false);
                setUploadStep('upload');
                setValidationProgress(0);
                setValidatedIssues([]);
                setCalculationProgress(0);
                setCalculatedMetrics([]);
                setUploadedFile(null);
                setIsProcessingFile(false);
              }}
              className="w-full bg-gray-900 text-white px-6 py-4 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-base font-medium"
            >
              <Download className="w-5 h-5" />
              Download Compliance Report
            </button>

            <div className="mt-4 text-center text-xs text-gray-500 space-y-1">
              <div>Report includes: EU Regulation 2024/1364 compliance • All sustainability indicators</div>
              <div>5-year trends • GHG emissions • Full audit trail • Data quality certification</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const getCurrentFacilities = () => {
    if (selectedFacility === 'all') return facilities;
    return facilities.filter(f => f.id === selectedFacility);
  };

  const getAveragePUE = () => {
    const facs = getCurrentFacilities();
    return (facs.reduce((sum, f) => sum + f.pue, 0) / facs.length).toFixed(2);
  };

  const getAverageCompliance = () => {
    const facs = getCurrentFacilities();
    return Math.round(facs.reduce((sum, f) => sum + f.complianceScore, 0) / facs.length);
  };

  const getTotalErrors = () => {
    return getCurrentFacilities().reduce((sum, f) => sum + f.validationErrors, 0);
  };

  const getTotalIssuesFixed = () => {
    return getCurrentFacilities().reduce((sum, f) => sum + f.issuesFixed, 0);
  };

  const DashboardView = () => (
    <div className="space-y-4">
      {/* Simple CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-light mb-4">Transform Your Compliance Workflow</h2>
        <p className="text-gray-300 text-sm mb-6">Upload your BMS data and get a complete EU compliance report in minutes</p>
        <button 
          onClick={() => setShowUploadFlow(true)}
          className="bg-white text-gray-900 px-8 py-4 rounded text-base font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Process Your Data Now
        </button>
        <div className="mt-6 grid grid-cols-4 gap-6 pt-6 border-t border-gray-700">
          <div>
            <div className="text-2xl font-light mb-1">{getTotalIssuesFixed().toLocaleString()}</div>
            <div className="text-xs text-gray-400">Issues Auto-Fixed</div>
          </div>
          <div>
            <div className="text-2xl font-light mb-1">2.3 sec</div>
            <div className="text-xs text-gray-400">Processing Time</div>
          </div>
          <div>
            <div className="text-2xl font-light mb-1">99.8%</div>
            <div className="text-xs text-gray-400">Data Quality</div>
          </div>
          <div>
            <div className="text-2xl font-light mb-1">100%</div>
            <div className="text-xs text-gray-400">EU Compliant</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Facilities</div>
          <div className="text-3xl font-light text-gray-900">{getCurrentFacilities().length}</div>
          <div className="text-xs text-gray-500 mt-1">All operational</div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Avg PUE</div>
          <div className="text-3xl font-light text-gray-900">{getAveragePUE()}</div>
          <div className="text-xs text-gray-500 mt-1">-8% vs 2024</div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Compliance</div>
          <div className="text-3xl font-light text-gray-900">{getAverageCompliance()}%</div>
          <div className="text-xs text-gray-500 mt-1">EU-ready</div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Data Quality</div>
          <div className="text-3xl font-light text-gray-900">99.2%</div>
          <div className="text-xs text-gray-500 mt-1">Automated</div>
        </div>
      </div>

      {/* Facility Status */}
      <div className="bg-white border border-gray-200 rounded">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Facility Integration</h2>
          <button 
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <Activity className="w-3 h-3" />
            {showTechnicalDetails ? 'Hide' : 'Show'} Technical Details
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {getCurrentFacilities().map(facility => (
            <div key={facility.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-medium text-gray-900">{facility.name}</h3>
                    {facility.integrationStatus === 'connected' && (
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        Connected
                      </span>
                    )}
                    {facility.integrationStatus === 'degraded' && (
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <AlertTriangle className="w-3 h-3" />
                        Degraded
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{facility.location} • {facility.capacity} • {facility.bmsSystem}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light text-gray-900">{facility.complianceScore}%</div>
                  <div className="text-xs text-gray-500">Compliance</div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500 mb-1">PUE</div>
                  <div className="font-medium text-gray-900">{facility.pue}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Last Sync</div>
                  <div className="font-medium text-gray-900">{facility.lastSync}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Issues Fixed</div>
                  <div className="font-medium text-gray-900">{facility.issuesFixed}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <div className="font-medium text-gray-900">{facility.integrationStatus === 'connected' ? 'Nominal' : 'Degraded'}</div>
                </div>
              </div>

              {showTechnicalDetails && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-4 gap-4 text-xs">
                    <div>
                      <div className="text-gray-500 mb-1">Data Points/Year</div>
                      <div className="font-mono text-gray-700">{facility.dataPoints.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Validation Errors</div>
                      <div className="font-mono text-gray-700">{facility.validationErrors}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">API Latency</div>
                      <div className="font-mono text-gray-700">{facility.apiLatency}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Data Interpolation</div>
                      <div className="font-mono text-gray-700">{(facility.validationErrors / facility.dataPoints * 100).toFixed(2)}%</div>
                    </div>
                  </div>
                  
                  {facility.integrationStatus === 'degraded' && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded text-xs">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900 mb-1">Integration Issue Detected</div>
                          <div className="text-gray-600">Vertiv API timeout rate elevated (8.2%). Data interpolation active for gaps &gt;15min. Manual review flagged for {facility.validationErrors} records.</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ComplianceView = () => {
    const complianceItems = [
      { id: 1, requirement: 'PUE Measurement & Reporting', status: 'compliant', auto: true },
      { id: 2, requirement: 'Renewable Energy Factor (REF)', status: 'compliant', auto: true },
      { id: 3, requirement: 'Energy Reuse Factor (ERF)', status: 'partial', auto: false, note: 'Waste heat recovery operational Q3-Q4 only' },
      { id: 4, requirement: 'Water Usage Effectiveness (WUE)', status: 'compliant', auto: true },
      { id: 5, requirement: 'Environmental Management System', status: 'compliant', auto: true },
      { id: 6, requirement: 'Monitoring & Calibration Records', status: 'compliant', auto: true },
      { id: 7, requirement: 'Scope 1 & 2 Emissions', status: 'compliant', auto: true },
      { id: 8, requirement: 'Scope 3 Emissions', status: 'partial', auto: false, note: 'Supply chain data 76% complete' },
    ];

    const compliantCount = complianceItems.filter(i => i.status === 'compliant').length;

    return (
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">EU Compliance Requirements</h2>
              <div className="text-right">
                <div className="text-2xl font-light text-gray-900">{Math.round((compliantCount / complianceItems.length) * 100)}%</div>
                <div className="text-xs text-gray-500">Overall Status</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-2 mb-6">
              {complianceItems.map(item => (
                <div key={item.id} className="border border-gray-200 rounded p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        {item.status === 'compliant' && <CheckCircle className="w-4 h-4 text-gray-600 flex-shrink-0" />}
                        {item.status === 'partial' && <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0" />}
                        <span className="text-sm font-medium text-gray-900">{item.requirement}</span>
                      </div>
                      
                      {item.auto && (
                        <div className="ml-7 text-xs text-gray-500">
                          Auto-generated from BMS data stream • Real-time validation
                        </div>
                      )}
                      
                      {item.note && (
                        <div className="ml-7 mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                          <span className="font-medium">Note:</span> {item.note}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 text-xs text-gray-600 whitespace-nowrap">
                      {item.status === 'compliant' ? '✓ Compliant' : '⚠ Partial'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-1">Generate Report</h3>
              <p className="text-sm text-gray-600">Complete professional compliance report ready for EU submission</p>
            </div>
            <button 
              onClick={() => setShowUploadFlow(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded text-sm font-medium transition-colors"
            >
              Process Data & Generate
            </button>
          </div>
        </div>
      </div>
    );
  };

  const HistoricalView = () => {
    const historicalData = [
      { year: '2021', pue: 1.52, wue: 1.2, ref: 45, erf: 0, carbon: 0.42 },
      { year: '2022', pue: 1.45, wue: 1.1, ref: 58, erf: 5, carbon: 0.38 },
      { year: '2023', pue: 1.38, wue: 0.98, ref: 72, erf: 12, carbon: 0.31 },
      { year: '2024', pue: 1.35, wue: 0.95, ref: 85, erf: 18, carbon: 0.25 },
      { year: '2025', pue: 1.32, wue: 0.92, ref: 91, erf: 22, carbon: 0.21 },
    ];

    return (
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Year-over-Year Performance</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-900">Metric</th>
                  {historicalData.map(year => (
                    <th key={year.year} className="text-center py-3 px-2 font-medium text-gray-900">{year.year}</th>
                  ))}
                  <th className="text-center py-3 px-2 font-medium text-gray-900">Δ 5Y</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 font-medium">PUE</td>
                  {historicalData.map(year => (
                    <td key={year.year} className="text-center py-3 px-2 font-mono">{year.pue}</td>
                  ))}
                  <td className="text-center py-3 px-2 font-mono">-13.2%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 font-medium">WUE</td>
                  {historicalData.map(year => (
                    <td key={year.year} className="text-center py-3 px-2 font-mono">{year.wue}</td>
                  ))}
                  <td className="text-center py-3 px-2 font-mono">-23.3%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 font-medium">REF (%)</td>
                  {historicalData.map(year => (
                    <td key={year.year} className="text-center py-3 px-2 font-mono">{year.ref}%</td>
                  ))}
                  <td className="text-center py-3 px-2 font-mono">+102%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-2 font-medium">ERF (%)</td>
                  {historicalData.map(year => (
                    <td key={year.year} className="text-center py-3 px-2 font-mono">{year.erf}%</td>
                  ))}
                  <td className="text-center py-3 px-2 font-mono">+22%</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-medium">Carbon (kgCO₂/kWh)</td>
                  {historicalData.map(year => (
                    <td key={year.year} className="text-center py-3 px-2 font-mono">{year.carbon}</td>
                  ))}
                  <td className="text-center py-3 px-2 font-mono">-50%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="text-2xl font-light text-gray-900 mb-1">13.2%</div>
            <div className="text-xs text-gray-500">PUE Reduction</div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="text-2xl font-light text-gray-900 mb-1">102%</div>
            <div className="text-xs text-gray-500">Renewable Energy Increase</div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="text-2xl font-light text-gray-900 mb-1">50%</div>
            <div className="text-xs text-gray-500">Carbon Reduction</div>
          </div>
        </div>
      </div>
    );
  };

  const GPUWorkloadView = () => {
    const totalGpus = gpuFleet.reduce((sum, f) => sum + f.count + (f.countSecondary || 0), 0);
    const totalGpuPower = gpuFleet.reduce((sum, f) => sum + f.powerDraw, 0);
    const totalFacilityPower = facilities.reduce((sum, f) => sum + parseFloat(f.capacity) * 1000, 0);
    const gpuEnergyPercent = ((totalGpuPower / totalFacilityPower) * 100).toFixed(1);
    const runningJobs = trainingJobs.filter(j => j.status === 'running');
    const totalEnergyKwh = runningJobs.reduce((sum, j) => sum + j.energyKwh, 0);
    const totalCarbonKg = runningJobs.reduce((sum, j) => sum + j.carbonKg, 0);
    const optimizedJobs = runningJobs.filter(j => j.zeusOptimized);
    const avgSavings = optimizedJobs.length > 0 ? (optimizedJobs.reduce((sum, j) => sum + j.savingsPercent, 0) / optimizedJobs.length).toFixed(0) : 0;

    return (
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-gray-400" />
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">GPU Fleet</div>
            </div>
            <div className="text-3xl font-light text-gray-900">{totalGpus.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Across {gpuFleet.length} facilities</div>
          </div>

          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-gray-400" />
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">GPU Power Draw</div>
            </div>
            <div className="text-3xl font-light text-gray-900">{(totalGpuPower / 1000).toFixed(1)} MW</div>
            <div className="text-xs text-gray-500 mt-1">{gpuEnergyPercent}% of facility load</div>
          </div>

          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Jobs</div>
            </div>
            <div className="text-3xl font-light text-gray-900">{runningJobs.length}</div>
            <div className="text-xs text-gray-500 mt-1">{totalEnergyKwh.toLocaleString()} kWh consumed</div>
          </div>

          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-gray-400" />
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Carbon Footprint</div>
            </div>
            <div className="text-3xl font-light text-gray-900">{(totalCarbonKg / 1000).toFixed(1)}t</div>
            <div className="text-xs text-gray-500 mt-1">CO₂e from active jobs</div>
          </div>

          <div className="bg-white border border-gray-200 rounded p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-gray-400" />
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Zeus Savings</div>
            </div>
            <div className="text-3xl font-light text-gray-900">{avgSavings}%</div>
            <div className="text-xs text-gray-500 mt-1">Avg energy reduction</div>
          </div>
        </div>

        {/* GPU Fleet by Facility */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">GPU Fleet Status</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse"></div>
              Zeus PowerMonitor Active
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {gpuFleet.map((fleet, idx) => (
              <div key={idx} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{fleet.facility}</h3>
                    <p className="text-sm text-gray-500">
                      {fleet.count}× {fleet.gpuType}
                      {fleet.gpuTypeSecondary && ` + ${fleet.countSecondary}× ${fleet.gpuTypeSecondary}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-light text-gray-900">{fleet.utilization}%</div>
                    <div className="text-xs text-gray-500">Utilization</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Power Draw</div>
                    <div className="font-medium text-gray-900">{(fleet.powerDraw / 1000).toFixed(1)} MW</div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                      <div className="bg-gray-700 h-1.5 rounded-full" style={{ width: `${(fleet.powerDraw / fleet.maxPower) * 100}%` }}></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{((fleet.powerDraw / fleet.maxPower) * 100).toFixed(0)}% of {(fleet.maxPower / 1000).toFixed(1)} MW capacity</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">GPU Temp (Avg)</div>
                    <div className="font-medium text-gray-900">{fleet.tempAvg}°C</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Energy (24h)</div>
                    <div className="font-medium text-gray-900">{(fleet.powerDraw * 24).toLocaleString()} kWh</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">GPU Energy / Facility Total</div>
                    <div className="font-medium text-gray-900">{((fleet.powerDraw / (parseFloat(facilities.find(f => f.name === fleet.facility)?.capacity || 5) * 1000)) * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Training Jobs */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Active Training Jobs</h2>
            <div className="text-xs text-gray-500">Measured by Zeus ZeusMonitor</div>
          </div>
          <div className="divide-y divide-gray-100">
            {trainingJobs.map(job => (
              <div key={job.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-medium text-gray-900">{job.name}</h3>
                      {job.status === 'running' ? (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse"></div>
                          Running
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          Queued
                        </span>
                      )}
                      {job.zeusOptimized && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                          Zeus Optimized −{job.savingsPercent}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {job.customer} • {job.facility} • {job.gpus}× {job.gpuType}
                    </p>
                  </div>
                  {job.status === 'running' && (
                    <div className="text-right ml-4">
                      <div className="text-lg font-light text-gray-900">{job.energyKwh.toLocaleString()} kWh</div>
                      <div className="text-xs text-gray-500">{job.carbonKg} kg CO₂e</div>
                    </div>
                  )}
                </div>

                {job.status === 'running' && (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-gray-700 h-2 rounded-full transition-all" style={{ width: `${job.progress}%` }}></div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-gray-600 w-10 text-right">{job.progress}%</span>
                    </div>

                    <div className="grid grid-cols-5 gap-4 text-xs">
                      <div>
                        <div className="text-gray-500 mb-0.5">Duration</div>
                        <div className="font-mono text-gray-700">{job.durationHrs}h</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-0.5">Batch Size</div>
                        <div className="font-mono text-gray-700">{job.batchSize}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-0.5">Power Limit</div>
                        <div className="font-mono text-gray-700">{job.powerLimit}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-0.5">Energy Cost</div>
                        <div className="font-mono text-gray-700">€{job.estimatedCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-0.5">Efficiency</div>
                        <div className="font-mono text-gray-700">{(job.energyKwh / job.durationHrs).toFixed(0)} kWh/h</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* GPU Energy → Facility Compliance Bridge */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">GPU Energy → Facility Compliance Bridge</h2>
            <p className="text-xs text-gray-500 mt-1">How Zeus GPU-level data feeds into EU compliance metrics</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Left: Zeus GPU Data */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5" />
                  Layer 1: Zeus GPU Measurement
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1">Total GPU Energy (24h)</div>
                  <div className="text-lg font-light text-gray-900">{((totalGpuPower * 24) / 1000).toFixed(1)} MWh</div>
                  <div className="text-xs text-gray-400 font-mono mt-1">zeus.ZeusMonitor.end_window()</div>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1">GPU Power Draw</div>
                  <div className="text-lg font-light text-gray-900">{(totalGpuPower / 1000).toFixed(1)} MW</div>
                  <div className="text-xs text-gray-400 font-mono mt-1">zeus.PowerMonitor.get_power()</div>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1">Zeus Optimized Savings</div>
                  <div className="text-lg font-light text-gray-900">{avgSavings}% avg</div>
                  <div className="text-xs text-gray-400 font-mono mt-1">zeus.BatchSizeOptimizer + PowerLimit</div>
                </div>
              </div>

              {/* Middle: Bridge Arrows */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Integration Layer
                </div>
                <div className="w-full border border-gray-300 rounded p-3 bg-white text-center">
                  <div className="text-xs text-gray-600 mb-2">GPU Load = E<sub>IT</sub> primary component</div>
                  <div className="font-mono text-sm text-gray-900">E<sub>GPU</sub> / E<sub>IT</sub> = {gpuEnergyPercent}%</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                <div className="w-full border border-gray-300 rounded p-3 bg-white text-center">
                  <div className="text-xs text-gray-600 mb-2">Cooling demand correlated to GPU thermal output</div>
                  <div className="font-mono text-sm text-gray-900">R² = 0.94</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                <div className="w-full border border-gray-300 rounded p-3 bg-white text-center">
                  <div className="text-xs text-gray-600 mb-2">Carbon intensity from grid × GPU energy</div>
                  <div className="font-mono text-sm text-gray-900">0.21 kgCO₂/kWh</div>
                </div>
              </div>

              {/* Right: EU Compliance Metrics */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5" />
                  Layer 2: EU Compliance Output
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1">PUE (GPU-aware)</div>
                  <div className="text-lg font-light text-gray-900">{getAveragePUE()}</div>
                  <div className="text-xs text-gray-400 mt-1">EU Reg 2024/1364 Annex III(a)</div>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1">Carbon per Training Job</div>
                  <div className="text-lg font-light text-gray-900">{(totalCarbonKg / runningJobs.length).toFixed(0)} kg avg</div>
                  <div className="text-xs text-gray-400 mt-1">GHG Protocol Scope 2</div>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1">Customer Carbon Reports</div>
                  <div className="text-lg font-light text-gray-900">{customerAttribution.length} customers</div>
                  <div className="text-xs text-gray-400 mt-1">CSRD-ready attribution</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zeus Optimization Details */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Zeus Optimization Engine</h2>
              <p className="text-xs text-gray-500 mt-1">Active optimizations reducing energy consumption per training job</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-light text-gray-900">{optimizedJobs.length}/{runningJobs.length}</div>
              <div className="text-xs text-gray-500">Jobs optimized</div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {zeusOptimizations.map((opt, idx) => (
              <div key={idx} className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{opt.job}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{opt.type}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium bg-gray-100 text-gray-800 px-3 py-1 rounded">
                      −{opt.energySaved} energy
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs mt-3">
                  <div>
                    <div className="text-gray-500 mb-0.5">Original Config</div>
                    <div className="font-mono text-gray-700">{opt.original}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-0.5">Optimized Config</div>
                    <div className="font-mono text-gray-900 font-medium">{opt.optimized}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-0.5">Method</div>
                    <div className="text-gray-600">{opt.method}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Carbon Attribution */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Customer Carbon Attribution</h2>
              <p className="text-xs text-gray-500 mt-1">Per-customer energy and carbon accounting from Zeus measurements</p>
            </div>
            <div className="text-xs text-gray-500">CSRD-ready • GHG Protocol aligned</div>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-900">Customer</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-900">Facility</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900">GPU Hours</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900">Energy (kWh)</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900">Carbon (kg CO₂e)</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-900">Cost (€)</th>
                </tr>
              </thead>
              <tbody>
                {customerAttribution.filter(c => c.energyKwh > 0).map((customer, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.jobs} active job{customer.jobs > 1 ? 's' : ''}</div>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{customer.facility}</td>
                    <td className="py-3 px-2 text-right font-mono text-gray-700">{customer.gpuHours.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right font-mono text-gray-700">{customer.energyKwh.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right font-mono text-gray-700">{customer.carbonKg.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right font-mono text-gray-700">€{customer.cost.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td className="py-3 px-2 text-gray-900" colSpan={2}>Total (Active)</td>
                  <td className="py-3 px-2 text-right font-mono text-gray-900">
                    {customerAttribution.filter(c => c.energyKwh > 0).reduce((s, c) => s + c.gpuHours, 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-gray-900">
                    {customerAttribution.filter(c => c.energyKwh > 0).reduce((s, c) => s + c.energyKwh, 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-gray-900">
                    {customerAttribution.filter(c => c.energyKwh > 0).reduce((s, c) => s + c.carbonKg, 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-gray-900">
                    €{customerAttribution.filter(c => c.energyKwh > 0).reduce((s, c) => s + c.cost, 0).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="heatcert-app min-h-screen bg-gray-50">
      {/* Animated background */}
      <div className="hc-bg" aria-hidden="true">
        <div className="hc-bg-orb hc-bg-orb-1" />
        <div className="hc-bg-orb hc-bg-orb-2" />
        <div className="hc-bg-orb hc-bg-orb-3" />
      </div>

      {showUploadFlow && <UploadFlow />}

      <div className="hc-header bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="hc-logo">
              <div className="hc-logo-icon">⬡</div>
              <span className="hc-logo-wordmark">HeatCert</span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-gray-400"
              >
                <option value="all">All Facilities</option>
                {facilities.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="hc-tabs flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'hc-tab-active'
                  : 'hc-tab-inactive'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('gpu-workload')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'gpu-workload'
                  ? 'hc-tab-active'
                  : 'hc-tab-inactive'
              }`}
            >
              GPU Workload
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'compliance'
                  ? 'hc-tab-active'
                  : 'hc-tab-inactive'
              }`}
            >
              Compliance
            </button>
            <button
              onClick={() => setActiveTab('historical')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'historical'
                  ? 'hc-tab-active'
                  : 'hc-tab-inactive'
              }`}
            >
              Historical
            </button>
            <button
              onClick={() => setActiveTab('eed-audit')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'eed-audit'
                  ? 'hc-tab-active'
                  : 'hc-tab-inactive'
              }`}
            >
              EED Audit
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'eed-audit' ? (
        <div key={activeTab} className="hc-tab-content">
          <EEDAudit />
        </div>
      ) : (
        <div key={activeTab} className="max-w-7xl mx-auto px-6 py-6 hc-tab-content">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'gpu-workload' && <GPUWorkloadView />}
          {activeTab === 'compliance' && <ComplianceView />}
          {activeTab === 'historical' && <HistoricalView />}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-gray-400 py-2 px-6 text-xs border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse"></div>
              <span>BMS Sync Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-3 h-3" />
              <span>3 Integrations</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="w-3 h-3" />
              <span>847 validation rules</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              <span>Zeus: 2,176 GPUs monitored</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3" />
              <span>Processing: 105K data points/year</span>
            </div>
          </div>
          <div className="font-mono text-gray-500">
            v2.1.4 • Last sync: 2m ago
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompliancePlatform;