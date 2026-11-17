import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card, { CardBody } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import { FileText, Video, Clock, ExternalLink, ArrowRight, Folder, UserCheck } from 'lucide-react';
import { MOCK_SECTIONS } from '../data/mockSections';

export const SectionsListPage = () => {
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const filteredSections = MOCK_SECTIONS.filter((sec) => {
    if (filterDifficulty === 'All') return true;
    return sec.difficulty === filterDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Scope Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-brand-50/70 border border-brand-200/60 rounded-xl text-xs text-brand-900">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">Sections & Recitations</Badge>
          <span className="font-medium">Connected to official Google Drive course storage</span>
        </div>
        <span className="text-brand-700 text-[11px]">Route: <code className="bg-white px-1.5 py-0.5 rounded border border-brand-200">/sections</code></span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Practical Sections & Recitations</h2>
          <p className="text-xs text-slate-500 mt-1">Teaching assistants recitations, problem sheets, solution notes, and video recordings.</p>
        </div>

        {/* Filter buttons */}
        <div className="inline-flex items-center rounded-full bg-white border border-[#D7E0E3] p-1 shadow-xs self-start sm:self-center">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => {
            const isActive = filterDifficulty === diff;
            return (
              <button
                key={diff}
                type="button"
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 sm:px-4 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#CCEB74] text-[#15313C] shadow-xs'
                    : 'text-[#6B8089] hover:text-[#15313C]'
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSections.map((sec) => (
          <Card key={sec.id} hoverable>
            <CardBody className="p-6 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#15313C] text-white">
                      SEC {sec.num}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-brand-600" /> {sec.instructor}
                    </span>
                  </div>
                  <Badge variant="neutral" size="sm">{sec.difficulty}</Badge>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">{sec.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {sec.description}
                </p>

                {/* Media Badges */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {sec.pdfDriveId && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <FileText className="w-3 h-3 stroke-[2]" /> PDF Handout
                    </span>
                  )}
                  {sec.videoDriveId && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                      <Video className="w-3 h-3 stroke-[2]" /> Video Recitation
                    </span>
                  )}
                  {sec.driveFolderUrl && (
                    <a
                      href={sec.driveFolderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Open Google Drive Folder"
                    >
                      <Folder className="w-3 h-3" /> Drive Folder
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" /> {sec.duration}
                </span>
                <Link to={`/sections/${sec.id}`}>
                  <Button variant="secondary" size="sm" icon={ArrowRight} iconPosition="right">
                    Open Section
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SectionsListPage;
