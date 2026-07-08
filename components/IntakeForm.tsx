"use client";

import { ClipboardList, Loader2, Upload, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Intake } from "@/lib/schemas";
import { sampleIntake } from "@/lib/sample";

type IntakeFormProps = {
  loading: boolean;
  onSubmit: (input: Intake) => Promise<void>;
};

function cloneSample(): Intake {
  return { ...sampleIntake };
}

export function IntakeForm({ loading, onSubmit }: IntakeFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<Intake>(cloneSample);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setLocalError("请上传图片文件。");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setLocalError("图片请控制在 4MB 以内。");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("读取图片失败。"));
      reader.readAsDataURL(file);
    });

    setForm((current) => ({
      ...current,
      imageDataUrl: dataUrl,
      imageName: file.name
    }));
    setLocalError(null);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    await onSubmit(form);
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-black/10 bg-white p-5 shadow-soft">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">Stage 1 输入</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">AI 宠物行为训练教练</h1>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-black/10 px-3 py-2 text-sm font-medium text-ink transition hover:bg-paper"
          onClick={() => {
            setForm(cloneSample());
            setLocalError(null);
          }}
        >
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          填入样例
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          宠物类型
          <select
            value={form.species}
            onChange={(event) => setForm((current) => ({ ...current, species: event.target.value as Intake["species"] }))}
            className="h-11 rounded-md border border-black/15 bg-white px-3 text-ink"
          >
            <option value="dog">狗</option>
            <option value="cat">猫</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          品种
          <input
            value={form.breed}
            onChange={(event) => setForm((current) => ({ ...current, breed: event.target.value }))}
            className="h-11 rounded-md border border-black/15 bg-white px-3 text-ink"
            placeholder="柯基"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          年龄
          <input
            value={form.ageText}
            onChange={(event) => setForm((current) => ({ ...current, ageText: event.target.value }))}
            className="h-11 rounded-md border border-black/15 bg-white px-3 text-ink"
            placeholder="8个月"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          是否绝育
          <select
            value={form.neutered ? "yes" : "no"}
            onChange={(event) => setForm((current) => ({ ...current, neutered: event.target.value === "yes" }))}
            className="h-11 rounded-md border border-black/15 bg-white px-3 text-ink"
          >
            <option value="no">未绝育</option>
            <option value="yes">已绝育</option>
          </select>
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm font-medium text-ink">
        问题行为描述
        <textarea
          value={form.freeText}
          onChange={(event) => setForm((current) => ({ ...current, freeText: event.target.value }))}
          className="min-h-36 resize-y rounded-md border border-black/15 bg-white px-3 py-3 leading-6 text-ink"
          placeholder="我一出门它就在家嚎叫抓门..."
        />
      </label>

      <div className="mt-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-black/10 px-3 py-2 text-sm font-medium text-ink transition hover:bg-paper"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            上传照片
          </button>
          {form.imageDataUrl ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-black/10 px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-paper"
              onClick={() => {
                setForm((current) => ({ ...current, imageDataUrl: null, imageName: null }));
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              <X className="h-4 w-4" aria-hidden="true" />
              移除照片
            </button>
          ) : null}
          <span className="text-sm text-ink/60">{form.imageName ?? "未上传照片"}</span>
        </div>

        {form.imageDataUrl ? (
          <div className="mt-3 overflow-hidden rounded-lg border border-black/10 bg-paper">
            <Image
              src={form.imageDataUrl}
              alt={form.imageName ?? "上传照片预览"}
              width={640}
              height={420}
              unoptimized
              className="h-44 w-full object-cover"
            />
          </div>
        ) : null}
      </div>

      {localError ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{localError}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <WandSparkles className="h-4 w-4" aria-hidden="true" />}
        {loading ? "生成中" : "生成训练计划"}
      </button>
    </form>
  );
}
