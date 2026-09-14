import { useEffect, useRef, useState } from "react";
import { Building2, Map, Beaker, Check, CheckCircle2, ChevronRight, Droplet, Grid, MonitorPlay, Presentation, } from "lucide-react";
import { clsx } from "clsx";
import { useNavigate } from "react-router";
import { apiFetch } from "../api";
// Map space display name -> DB location type value
const SPACE_TYPE_MAP = {
    Classroom: "classroom",
    Lab: "lab",
    Washroom: "washroom",
    Others: "others",
    Campus: "campus_landmark",
};
export function ReportProblem() {
    const [step, setStep] = useState(1);
    const [locType, setLocType] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [blockId, setBlockId] = useState(null);
    const [space, setSpace] = useState(null);
    const [roomNumber, setRoomNumber] = useState("");
    const [landmarkName, setLandmarkName] = useState("");
    const [issueType, setIssueType] = useState("issue");
    const [subType, setSubType] = useState(""); // free text or chip selection
    const [selectedChips, setSelectedChips] = useState([]);
    const [description, setDescription] = useState("");
    const [photo, setPhoto] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successId, setSuccessId] = useState(null);
    const [duplicate, setDuplicate] = useState(null);
    const fileRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        apiFetch('/api/blocks')
            .then(r => r.json())
            .then((data) => {
            if (Array.isArray(data))
                setBlocks(data);
        })
            .catch(() => { });
    }, []);
    const handleNext = () => setStep(s => s + 1);
    const effectiveSubType = selectedChips.length > 0 ? selectedChips.join(", ") : subType;
    const handleSubmit = async () => {
        setError("");
        if (!blockId) {
            setError("Please select a block.");
            return;
        }
        if (!space) {
            setError("Please select a space type.");
            return;
        }
        if (!description.trim()) {
            setError("Please add a description.");
            return;
        }
        if (!effectiveSubType.trim()) {
            setError("Please describe what the issue is.");
            return;
        }
        setSubmitting(true);
        const formData = new FormData();
        formData.append("block_id", String(blockId));
        formData.append("location_type", SPACE_TYPE_MAP[space] ?? "others");
        formData.append("report_type", issueType);
        formData.append("sub_type", effectiveSubType.trim());
        formData.append("description", description.trim());
        if (roomNumber.trim())
            formData.append("room_number", roomNumber.trim());
        if (landmarkName.trim())
            formData.append("landmark_name", landmarkName.trim());
        if (photo)
            formData.append("photo", photo);
        const res = await apiFetch("/api/reports", { method: "POST", body: formData });
        const data = await res.json();
        setSubmitting(false);
        if (res.status === 409 && data.duplicate) {
            setDuplicate(data.report);
            setStep(5);
            return;
        }
        if (!res.ok) {
            setError(data.error ?? "Submission failed. Please try again.");
            return;
        }
        setSuccessId(data.report_id);
        setStep(5);
    };
    const resetForm = () => {
        setStep(1);
        setLocType(null);
        setBlockId(null);
        setSpace(null);
        setRoomNumber("");
        setLandmarkName("");
        setIssueType("issue");
        setSubType("");
        setSelectedChips([]);
        setDescription("");
        setPhoto(null);
        setError("");
        setSuccessId(null);
        setDuplicate(null);
    };
    const campusBlock = blocks.find(b => b.name === "Campus");
    const handleLocationNext = () => {
        if (locType === "campus") {
            if (!campusBlock) {
                setError("Campus is not available yet. Please wait a moment and try again.");
                return;
            }
            setBlockId(campusBlock.id);
            setSpace("Campus");
            setIssueType("damage");
        }
        setError("");
        setStep(2);
    };
    const renderStepIndicator = () => {
        const totalSteps = locType === "campus" ? 3 : 4;
        return (<div className="flex items-center justify-center mb-10 w-full max-w-md mx-auto">
      {Array.from({ length: totalSteps }, (_, index) => index + 1).map((s) => (<div key={s} className="flex items-center w-full last:w-auto">
          <div className="relative flex flex-col items-center gap-2">
            <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors", step === s ? "bg-navy text-white" : step > s ? "bg-success text-white" : "bg-page-bg text-ink-muted border border-line")}>
              {step > s ? <Check className="w-4 h-4"/> : s}
            </div>
            <span className={clsx("absolute top-10 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider", step === s ? "text-navy" : "text-ink-muted")}>
              Step {s}
            </span>
          </div>
          {s < totalSteps && (<div className={clsx("flex-1 h-1 mx-2 rounded-full", step > s ? "bg-success" : "bg-page-bg border border-line")}/>)}
        </div>))}
    </div>);
    };
    const blockOptions = blocks.filter(b => b.name !== "Campus");
    return (<div className="w-full max-w-[680px] mx-auto py-8">
      {step < 5 && renderStepIndicator()}

      <div className="bg-white rounded-xl shadow-sm border border-line p-8 min-h-[400px]">

        {/* STEP 1 — Location type */}
        {step === 1 && (<div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-navy">Where is the issue?</h2>
              <p className="text-ink-muted text-sm mt-1">Select the broad location type.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "block", icon: Building2, title: "Block", desc: "An issue inside a classroom, lab, washroom, or corridor" },
                { val: "campus", icon: Map, title: "Campus", desc: "An issue in an open campus area — parking, grounds, gates" },
            ].map(opt => (<button key={opt.val} onClick={() => { setLocType(opt.val); setBlockId(null); setSpace(null); setError(""); if (opt.val === "campus") setIssueType("damage"); }} className={clsx("p-6 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col gap-3", locType === opt.val ? "border-navy border-2 bg-navy/5" : "border-line hover:border-navy/30")}>
                  {locType === opt.val && <div className="absolute top-4 right-4 text-navy"><CheckCircle2 className="w-5 h-5 fill-navy text-white"/></div>}
                  <div className={clsx("w-12 h-12 rounded-lg flex items-center justify-center", locType === opt.val ? "bg-navy text-white" : "bg-page-bg text-ink-muted")}>
                    <opt.icon className="w-6 h-6"/>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink text-base">{opt.title}</h3>
                    <p className="text-sm text-ink-muted mt-1">{opt.desc}</p>
                  </div>
                </button>))}
            </div>
            <div className="mt-8 flex justify-end">
              <button disabled={!locType || (locType === "campus" && !campusBlock)} onClick={handleLocationNext} className="bg-navy hover:bg-navy-deep disabled:bg-line disabled:text-ink-muted text-white font-medium px-8 py-2.5 rounded-md flex items-center gap-2">
                Next <ChevronRight className="w-4 h-4"/>
              </button>
            </div>
          </div>)}

        {/* STEP 2 — Block selection */}
        {step === 2 && locType === "block" && (<div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-navy">Which block?</h2>
            </div>
            {blocks.length === 0 ? (<p className="text-center text-sm text-ink-muted">Loading blocks…</p>) : (<div className="grid grid-cols-3 gap-3">
                {blockOptions.map(b => (<button key={b.id} onClick={() => setBlockId(b.id)} className={clsx("py-4 rounded-lg font-medium text-sm transition-all border", blockId === b.id ? "bg-navy text-white border-navy" : "bg-white text-ink border-line hover:border-navy/30")}>
                    {b.name}
                  </button>))}
              </div>)}
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-ink-muted hover:text-ink font-medium px-4 py-2.5">Back</button>
              <button disabled={!blockId} onClick={handleNext} className="bg-navy hover:bg-navy-deep disabled:bg-line disabled:text-ink-muted text-white font-medium px-8 py-2.5 rounded-md flex items-center gap-2">
                Next <ChevronRight className="w-4 h-4"/>
              </button>
            </div>
          </div>)}

        {/* STEP 3 — Space type */}
        {step === 3 && locType === "block" && (<div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-navy">What kind of space?</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ id: "Classroom", icon: Presentation }, { id: "Lab", icon: Beaker }, { id: "Washroom", icon: Droplet }, { id: "Others", icon: Grid }].map(s => (<button key={s.id} onClick={() => {
                    setSpace(s.id);
                    if (s.id === "Washroom" && issueType === "issue") {
                      setIssueType("damage");
                      setSelectedChips([]);
                      setSubType("");
                    }
                  }} className={clsx("p-5 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all", space === s.id ? "bg-navy/5 border-navy border-2 text-navy" : "bg-white border-line text-ink-muted hover:border-navy/30")}>
                  <s.icon className="w-8 h-8"/>
                  <span className="font-semibold text-ink">{s.id}</span>
                </button>))}
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(2)} className="text-ink-muted hover:text-ink font-medium px-4 py-2.5">Back</button>
              <button disabled={!space} onClick={() => {
                if (space === "Washroom" && issueType === "issue") {
                  setIssueType("damage");
                  setSelectedChips([]);
                  setSubType("");
                }
                handleNext();
              }} className="bg-navy hover:bg-navy-deep disabled:bg-line disabled:text-ink-muted text-white font-medium px-8 py-2.5 rounded-md flex items-center gap-2">
                Next <ChevronRight className="w-4 h-4"/>
              </button>
            </div>
          </div>)}

        {/* STEP 2 — Campus landmark */}
        {step === 2 && locType === "campus" && (<div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-navy">Where on campus?</h2>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">Landmark / Area name</span>
              <input type="text" value={landmarkName} onChange={e => setLandmarkName(e.target.value)} className="w-full border border-line rounded-md p-3 outline-none focus:border-navy text-sm" placeholder="e.g. Main Gate, Parking Area, Basketball Court"/>
            </label>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-ink-muted hover:text-ink font-medium px-4 py-2.5">Back</button>
              <button disabled={!landmarkName.trim()} onClick={handleNext} className="bg-navy hover:bg-navy-deep disabled:bg-line disabled:text-ink-muted text-white font-medium px-8 py-2.5 rounded-md flex items-center gap-2">
                Next <ChevronRight className="w-4 h-4"/>
              </button>
            </div>
          </div>)}

        {/* Final step — Step 3 for Campus, Step 4 for block reports */}
        {step === (locType === "campus" ? 3 : 4) && (<div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-navy">Describe the problem</h2>
            </div>

            {/* Campus & Washroom reports support Damage and Other only. */}
            <div className="flex bg-page-bg p-1 rounded-lg">
              {(locType === "campus" || space === "Washroom" ? ["damage", "other"] : ["issue", "damage", "other"]).map(t => (<button key={t} onClick={() => { setIssueType(t); setSelectedChips([]); setSubType(""); }} className={clsx("flex-1 py-2 text-sm font-medium rounded-md capitalize", issueType === t ? "bg-white text-navy shadow-sm" : "text-ink-muted")}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>))}
            </div>

            {/* Issue chips */}
            {issueType === "issue" && space !== "Washroom" && (<div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-ink">What is not working?</label>
                <div className="flex flex-wrap gap-2">
                  {["Switch", "Fan", "Light", "Projector", "AC", "Door Lock", "Tap/Flush", "Other"].map(chip => {
                    const sel = selectedChips.includes(chip);
                    return (<button key={chip} type="button" onClick={() => setSelectedChips(p => sel ? p.filter(x => x !== chip) : [...p, chip])} className={clsx("px-4 py-2 rounded-full text-sm font-medium border transition-colors", sel ? "bg-navy text-white border-navy" : "bg-white text-ink border-line hover:border-navy/30")}>
                        {chip}
                      </button>);
                })}
                </div>
              </div>)}

            {/* Damage / Other — free-text sub_type */}
            {(issueType === "damage" || issueType === "other") && (<label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">
                  {issueType === "damage" ? "What is damaged?" : "Briefly describe the issue"}
                </span>
                <input type="text" value={subType} onChange={e => setSubType(e.target.value)} className="w-full border border-line rounded-md p-3 outline-none focus:border-navy text-sm" placeholder={issueType === "damage" ? (space === "Washroom" ? "e.g. Broken tap, Flush damaged, Cracked mirror" : "e.g. Broken bench, Cracked window") : (space === "Washroom" ? "e.g. Water leakage, No water supply, Unclean washroom" : "e.g. Garbage pile, Blocked drain")}/>
              </label>)}

            {/* Photo upload for damage */}
            {issueType === "damage" && (<div>
                <label className="text-sm font-medium text-ink block mb-2">Photo (optional)</label>
                <input ref={fileRef} type="file" accept="image/jpg,image/jpeg,image/png,image/webp" className="hidden" onChange={e => setPhoto(e.target.files?.[0] ?? null)}/>
                <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-line hover:border-navy/30 rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-page-bg/50 cursor-pointer transition-colors">
                  <MonitorPlay className="w-8 h-8 text-ink-muted"/>
                  <p className="font-medium text-ink">{photo ? photo.name : "Tap to upload a photo"}</p>
                  <p className="text-xs text-ink-muted">JPG, PNG, WebP — max 5 MB</p>
                </div>
              </div>)}

            {/* Description */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">Describe in detail</span>
              <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-line rounded-md p-3 outline-none focus:border-navy text-sm resize-none" placeholder="Give enough detail so staff can find and fix it."/>
            </label>

            {/* Room / landmark */}
            {locType === "block" && (<label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">Room / Lab number</span>
                <input type="text" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} className="w-full border border-line rounded-md p-3 outline-none focus:border-navy text-sm" placeholder="e.g. Room 204, Lab 3"/>
              </label>)}

            {error && <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-md px-4 py-3">{error}</p>}

            <div className="mt-4 flex justify-between">
              <button onClick={() => setStep(locType === "campus" ? 2 : 3)} className="text-ink-muted hover:text-ink font-medium px-4 py-2.5">Back</button>
              <button onClick={handleSubmit} disabled={submitting} className="bg-navy hover:bg-navy-deep disabled:opacity-60 text-white font-medium px-8 py-2.5 rounded-md">
                {submitting ? "Submitting…" : "Submit Report"}
              </button>
            </div>
          </div>)}

        {/* STEP 5 — Success or duplicate */}
        {step === 5 && (<div className="flex flex-col gap-6 items-center justify-center py-12 animate-in zoom-in-95">
            {duplicate ? (<>
                <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mb-4">
                  <Check className="w-10 h-10 text-warning"/>
                </div>
                <h2 className="text-2xl font-semibold text-navy">This issue was already reported.</h2>
                <p className="text-ink-muted text-center max-w-sm">
                  A report for <strong>{duplicate.sub_type}</strong> at this location already exists with status <strong>{duplicate.status}</strong>. You can confirm it instead to boost its priority.
                </p>
                <div className="flex gap-4 mt-4">
                  <button onClick={() => navigate("/student/reports")} className="bg-navy text-white font-medium px-6 py-2.5 rounded-md hover:bg-navy-deep">
                    View Reports
                  </button>
                  <button onClick={resetForm} className="bg-white border border-line text-navy font-medium px-6 py-2.5 rounded-md hover:bg-page-bg">
                    Report Something Else
                  </button>
                </div>
              </>) : (<>
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
                  <Check className="w-10 h-10 text-success"/>
                </div>
                <h2 className="text-2xl font-semibold text-navy">Report submitted!</h2>
                <p className="text-ink-muted">Report #{successId}</p>
                <p className="text-ink-muted mt-1 text-center">You'll be notified when staff acknowledge it.</p>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => navigate("/student/reports")} className="bg-navy hover:bg-navy-deep text-white font-medium px-6 py-2.5 rounded-md">
                    View My Reports
                  </button>
                  <button onClick={resetForm} className="bg-white border border-line hover:bg-page-bg text-navy font-medium px-6 py-2.5 rounded-md">
                    Report Another Issue
                  </button>
                </div>
              </>)}
          </div>)}
      </div>
    </div>);
}
