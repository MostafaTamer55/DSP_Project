import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  Video,
  Folder,
  UserCheck,
  Clock,
} from 'lucide-react';
import { getSectionById } from '../data/mockSections';

export const SectionDetailPage = () => {
  const { sectionId = '1' } = useParams();
  const section = getSectionById(sectionId);

  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' | 'video'

  const primaryDownloadUrl = section.pdfDriveId
    ? `https://drive.google.com/uc?export=download&id=${section.pdfDriveId}`
    : '#';

  const secondaryDownloadUrl = section.secondaryPdfDriveId
    ? `https://drive.google.com/uc?export=download&id=${section.secondaryPdfDriveId}`
    : '#';

  const pdfPreviewUrl = section.pdfDriveId
    ? `https://drive.google.com/file/d/${section.pdfDriveId}/preview`
    : null;

  const videoPreviewUrl = section.videoDriveId
    ? `https://drive.google.com/file/d/${section.videoDriveId}/preview`
    : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb nav & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <Link
          to="/sections"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Back to Sections</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          {section.driveFolderUrl && (
            <a
              href={section.driveFolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Folder className="w-3.5 h-3.5 text-brand-600" />
              <span>Open in Google Drive</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}

          {section.pdfDriveId && (
            <a
              href={primaryDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#CCEB74] hover:bg-[#bfee50] text-[#15313C] px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.25]" />
              <span>Download PDF</span>
            </a>
          )}
        </div>
      </div>

      {/* Title & Metadata Card */}
      <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#EAF0F2] shadow-sm">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="brand" size="sm">SEC {section.num}</Badge>
          <Badge variant="neutral" size="sm">{section.difficulty}</Badge>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium ml-1">
            <UserCheck className="w-3.5 h-3.5 text-brand-600" /> {section.instructor}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1 ml-2 font-medium">
            <Clock className="w-3.5 h-3.5" /> {section.duration}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {section.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-3xl">
          {section.description}
        </p>

        {/* Tab switchers if both PDF & Video are available */}
        {(pdfPreviewUrl && videoPreviewUrl) && (
          <div className="flex gap-2 mt-5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('pdf')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'pdf'
                  ? 'bg-[#15313C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Handout PDF
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-[#15313C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Video Recitation
            </button>
          </div>
        )}
      </div>

      {/* Main Content Viewer (PDF or Video) */}
      <div className="w-full bg-white/70 backdrop-blur-sm rounded-[32px] sm:rounded-[36px] border border-[#EAF0F2] shadow-[0_15px_45px_rgba(21,49,60,0.035)] p-4 sm:p-6 min-h-[600px] flex flex-col items-center">
        {/* If PDF Tab active or only PDF exists */}
        {(activeTab === 'pdf' || !videoPreviewUrl) && pdfPreviewUrl && (
          <div className="w-full h-[760px] rounded-2xl overflow-hidden border border-[#EAF0F2] shadow-xs bg-white">
            <iframe
              src={pdfPreviewUrl}
              title={`${section.title} PDF`}
              className="w-full h-full border-none"
              allow="autoplay"
            />
          </div>
        )}

        {/* If Video Tab active or only Video exists */}
        {(activeTab === 'video' || !pdfPreviewUrl) && videoPreviewUrl && (
          <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-[#EAF0F2] shadow-xs bg-[#15313C]">
            <iframe
              src={videoPreviewUrl}
              title={`${section.title} Video`}
              className="w-full h-full border-none"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        )}

        {/* If neither preview is directly available */}
        {!pdfPreviewUrl && !videoPreviewUrl && (
          <div className="text-center py-20">
            <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Materials on Google Drive</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              This recitation contains practice sheets and handouts stored in the course Google Drive folder.
            </p>
            {section.driveFolderUrl && (
              <a
                href={section.driveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 bg-[#15313C] hover:bg-[#112730] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Open Google Drive Folder</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Secondary Files Card if available */}
      {section.secondaryPdfDriveId && (
        <Card>
          <CardBody className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <FileText className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Alternative / Additional Notes</h4>
                <p className="text-xs text-slate-500">{section.secondaryPdfFileName}</p>
              </div>
            </div>
            <a
              href={secondaryDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Notes</span>
            </a>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default SectionDetailPage;
