"use client";

import type React from 'react';
import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileImage, Download, Loader2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HeicConverter() {
  const [heicFile, setHeicFile] = useState<File | null>(null);
  const [heicFileInfo, setHeicFileInfo] = useState<{ name: string; size: string } | null>(null);
  const [convertedJpgUrl, setConvertedJpgUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const resetState = useCallback(() => {
    setHeicFile(null);
    setHeicFileInfo(null);
    setConvertedJpgUrl(null);
    setIsConverting(false);
    setProgressValue(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  }, []);

  const handleFileSelect = useCallback((file: File | null) => {
    resetState();
    if (file) {
      if (!file.name.toLowerCase().endsWith('.heic') && !file.name.toLowerCase().endsWith('.heif')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a .HEIC or .HEIF file.",
          variant: "destructive",
          action: <AlertTriangle className="h-5 w-5 text-destructive-foreground" />,
        });
        return;
      }
      setHeicFile(file);
      setHeicFileInfo({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  }, [resetState, toast]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files ? event.target.files[0] : null);
  };

  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow dropping
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    handleFileSelect(event.dataTransfer.files ? event.dataTransfer.files[0] : null);
  };

  const handleConvert = useCallback(async () => {
    if (!heicFile) return;

    setIsConverting(true);
    setProgressValue(0);
    setConvertedJpgUrl(null);

    // Simulate conversion progress
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress <= 100) {
        setProgressValue(currentProgress);
      } else {
        clearInterval(progressInterval);
      }
    }, 150); // Simulate 1.5 seconds conversion time

    // Simulate conversion delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgressValue(100);
      // In a real app, you'd perform the HEIC to JPG conversion here.
      // For this simulation, we'll use a placeholder image.
      const placeholderUrl = `https://placehold.co/600x400.png`;
      setConvertedJpgUrl(placeholderUrl);
      setIsConverting(false);
      toast({
        title: "Conversion Successful!",
        description: "Your HEIC file has been converted to JPG.",
        action: <CheckCircle2 className="h-5 w-5 text-accent-foreground" />,
        className: "bg-accent text-accent-foreground border-accent"
      });
    }, 1500);
  }, [heicFile, toast]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-center">HEIC to JPG Converter</CardTitle>
        <CardDescription className="text-center">
          Upload your HEIC file, convert it to JPG, and download the result.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!heicFile && !isConverting && !convertedJpgUrl && (
          <div
            className={cn(
              "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors",
              dragOver ? "border-primary bg-primary/10" : "border-muted"
            )}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={openFileDialog}
          >
            <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-semibold">Drag & drop a HEIC/HEIF file here</p>
            <p className="text-sm text-muted-foreground">or click to select a file</p>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".heic,.heif"
              onChange={onFileChange}
              className="hidden"
              aria-label="File uploader"
            />
          </div>
        )}

        {heicFileInfo && !isConverting && !convertedJpgUrl && (
          <div className="p-4 border rounded-lg bg-secondary/30">
            <div className="flex items-center space-x-3 mb-4">
              <FileImage className="w-10 h-10 text-primary" />
              <div>
                <p className="font-semibold text-sm truncate max-w-xs">{heicFileInfo.name}</p>
                <p className="text-xs text-muted-foreground">{heicFileInfo.size}</p>
              </div>
            </div>
            <Button onClick={handleConvert} className="w-full" disabled={isConverting}>
              <UploadCloud className="mr-2 h-4 w-4" /> Convert to JPG
            </Button>
          </div>
        )}

        {isConverting && (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-primary font-semibold">Converting, please wait...</p>
            <Progress value={progressValue} className="w-full h-2" />
             <p className="text-sm text-muted-foreground">{progressValue}%</p>
          </div>
        )}

        {convertedJpgUrl && !isConverting && (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden shadow-md">
               <Image
                src={convertedJpgUrl}
                alt="Converted JPG Preview"
                width={600}
                height={400}
                className="w-full h-auto object-contain"
                data-ai-hint="converted image"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = convertedJpgUrl;
                  link.download = heicFileInfo?.name.replace(/\.(heic|heif)$/i, '.jpg') || 'converted.jpg';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                aria-label="Download converted JPG file"
              >
                <Download className="mr-2 h-4 w-4" /> Download JPG
              </Button>
              <Button variant="outline" onClick={resetState} className="w-full">
                 <XCircle className="mr-2 h-4 w-4" /> Convert Another File
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground">
        <p>Your files are processed locally in your browser and are not uploaded to any server.</p>
      </CardFooter>
    </Card>
  );
}
