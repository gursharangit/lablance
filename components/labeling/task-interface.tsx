"use client";
// components/labeling/task-interface.tsx
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  ArrowRight, 
  Loader2, 
  Info, 
  CheckCircle2,
  ImageIcon,
  AlertCircle,
  CircleDollarSign,
  ArrowUpRight,
  Maximize,
  Minimize,
  HelpCircle,
  RefreshCw
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Image Classification Task UI
const ImageClassificationTask = ({ 
  task, 
  onSubmit,
  isSubmitting 
}: { 
  task: any; 
  onSubmit: (result: any) => void;
  isSubmitting: boolean;
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [imageExpanded, setImageExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Extract classification options from task data
  const options = Array.isArray(task.taskData?.options) && task.taskData.options.length > 0 
    ? task.taskData.options 
    : ['Car', 'Truck', 'Motorcycle', 'Bicycle', 'Bus', 'Pedestrian', 'Other'];
  
  const handleSubmit = () => {
    if (!selectedClass) return;
    
    onSubmit({
      class: selectedClass,
      confidence: 'high'
    });
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Error loading image:', task.fileUrl);
    setImageError(true);
    // Set a fallback image
    e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Load+Error';
  };
  
  return (
    <div className="space-y-4">
      <div className={`relative ${imageExpanded ? 'fixed inset-0 z-50 bg-background/95 p-4 flex items-center justify-center' : ''}`}>
        <div className={`${imageExpanded ? 'max-w-4xl w-full max-h-screen' : 'aspect-video w-full bg-muted/30 relative'} rounded-md overflow-hidden border`}>
          {task.fileUrl ? (
            <Image 
              src={task.fileUrl} 
              alt="Image to classify"
              fill={!imageExpanded}
              width={imageExpanded ? 1024 : undefined}
              height={imageExpanded ? 768 : undefined}
              className={`${imageExpanded ? 'w-full h-auto object-contain' : 'object-cover'}`}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
              <span className="sr-only">No image available</span>
            </div>
          )}
        </div>
        <Button 
          size="sm"
          variant="secondary"
          className="absolute top-2 right-2"
          onClick={() => setImageExpanded(!imageExpanded)}
        >
          {imageExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
        {imageExpanded && (
          <Button 
            size="sm"
            variant="outline"
            className="absolute bottom-4 right-4"
            onClick={() => setImageExpanded(false)}
          >
            Close
          </Button>
        )}
      </div>
      
      {imageError && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800">
          Note: The original image couldn't be loaded. Using a placeholder image instead.
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Select the correct class:</h3>
        <RadioGroup 
          value={selectedClass} 
          onValueChange={setSelectedClass}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
        >
          {options.map((option: string) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${option}`} />
              <Label htmlFor={`option-${option}`} className="cursor-pointer">{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
        >
          Skip
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedClass || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Object Detection Task UI with Canvas for drawing bounding boxes
const ObjectDetectionTask = ({ 
  task, 
  onSubmit,
  isSubmitting 
}: { 
  task: any; 
  onSubmit: (result: any) => void;
  isSubmitting: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [boxes, setBoxes] = useState<any[]>([]);
  const [currentClass, setCurrentClass] = useState<string>('Car');
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [imageExpanded, setImageExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Extract classification options from task data
  const options = task.taskData?.options || [
    'Car', 'Truck', 'Motorcycle', 'Bicycle', 'Bus', 'Pedestrian', 'Other'
  ];
  
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match image
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    
    // Draw image
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    
    // Draw all boxes
    boxes.forEach(box => {
      ctx.strokeStyle = getColorForClass(box.class);
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      
      // Draw label
      ctx.fillStyle = getColorForClass(box.class);
      ctx.fillRect(box.x, box.y - 20, ctx.measureText(box.class).width + 10, 20);
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.fillText(box.class, box.x + 5, box.y - 5);
    });
  }, [boxes, imageLoaded]);
  
  const getColorForClass = (className: string) => {
    const colors: Record<string, string> = {
      'Car': '#FF5733',
      'Truck': '#33FF57',
      'Motorcycle': '#3357FF',
      'Bicycle': '#F033FF',
      'Bus': '#33FFF0',
      'Pedestrian': '#FFF033',
      'Other': '#FF33A8'
    };
    
    return colors[className] || '#FF5733';
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPos({ x, y });
    setDrawing(true);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Redraw canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    }
    
    // Draw existing boxes
    boxes.forEach(box => {
      ctx.strokeStyle = getColorForClass(box.class);
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      
      // Draw label
      ctx.fillStyle = getColorForClass(box.class);
      ctx.fillRect(box.x, box.y - 20, ctx.measureText(box.class).width + 10, 20);
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.fillText(box.class, box.x + 5, box.y - 5);
    });
    
    // Draw current box
    ctx.strokeStyle = getColorForClass(currentClass);
    ctx.lineWidth = 2;
    const width = x - startPos.x;
    const height = y - startPos.y;
    ctx.strokeRect(startPos.x, startPos.y, width, height);
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = x - startPos.x;
    const height = y - startPos.y;
    
    // Only add box if it has sufficient size
    if (Math.abs(width) > 10 && Math.abs(height) > 10) {
      const newBox = {
        x: width > 0 ? startPos.x : x,
        y: height > 0 ? startPos.y : y,
        width: Math.abs(width),
        height: Math.abs(height),
        class: currentClass
      };
      
      setBoxes([...boxes, newBox]);
    }
    
    setDrawing(false);
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const removeBox = (index: number) => {
    const newBoxes = [...boxes];
    newBoxes.splice(index, 1);
    setBoxes(newBoxes);
  };
  
  const handleSubmit = () => {
    if (boxes.length === 0) return;
    
    onSubmit({
      boxes: boxes,
      imageWidth: imageRef.current?.width || 0,
      imageHeight: imageRef.current?.height || 0
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="relative">
            <div className="hidden">
              <img 
                ref={imageRef}
                src={task.fileUrl} 
                alt="Reference image"
                onLoad={handleImageLoad}
              />
            </div>
            <div className={`${imageExpanded ? 'fixed inset-0 z-50 bg-background/95 p-4 flex items-center justify-center' : 'relative aspect-video bg-muted/30'}`}>
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className={`${imageExpanded ? 'max-w-full max-h-full' : 'w-full h-full'} border rounded-md cursor-crosshair`}
              />
              
              <Button 
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => setImageExpanded(!imageExpanded)}
              >
                {imageExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              
              {imageExpanded && (
                <Button 
                  size="sm"
                  variant="outline"
                  className="absolute bottom-4 right-4"
                  onClick={() => setImageExpanded(false)}
                >
                  Close
                </Button>
              )}
            </div>
            
            <div className="flex items-center mt-2 space-x-2 flex-wrap">
              {options.map((option: string) => (
                <Button
                  key={option}
                  size="sm"
                  variant={currentClass === option ? "default" : "outline"}
                  onClick={() => setCurrentClass(option)}
                  className="mb-2"
                >
                  {option}
                </Button>
              ))}
            </div>
            
            <div className="bg-muted/30 p-2 rounded-md mt-2">
              <p className="text-xs text-muted-foreground">
                <HelpCircle className="h-3 w-3 inline-block mr-1" />
                Click and drag to draw bounding boxes. Select the class before drawing each box.
              </p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="border rounded-md p-4 h-full">
            <h3 className="font-medium mb-2">Bounding Boxes ({boxes.length})</h3>
            
            {boxes.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No bounding boxes drawn yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-2">
                {boxes.map((box, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: getColorForClass(box.class) }}
                      ></div>
                      <span className="text-sm">{box.class}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeBox(index)}
                      className="h-6 w-6 p-0"
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
        >
          Skip
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={boxes.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Text Annotation Task UI
const TextAnnotationTask = ({ 
  task, 
  onSubmit,
  isSubmitting 
}: { 
  task: any; 
  onSubmit: (result: any) => void;
  isSubmitting: boolean;
}) => {
  const [text, setText] = useState('');
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [currentCategory, setCurrentCategory] = useState('Person');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  
  // Extract text content and category options from task data
  const textContent = task.taskData?.text || 'Apple CEO Tim Cook announced the new iPhone 15 at their headquarters in Cupertino, California. The device will be available starting September 22nd for $799.';
  const categories = task.taskData?.categories || [
    'Person', 'Organization', 'Location', 'Date', 'Product', 'Price', 'Other'
  ];
  
  useEffect(() => {
    setText(textContent);
  }, [textContent]);
  
  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const textElement = document.getElementById('text-content');
    
    if (!textElement || !textElement.contains(range.commonAncestorContainer)) return;
    
    // Get selection indices relative to the text content
    const textBefore = text.substring(0, range.startOffset);
    const textAfter = text.substring(range.endOffset);
    
    setSelectionStart(range.startOffset);
    setSelectionEnd(range.endOffset);
  };
  
  const addAnnotation = () => {
    if (selectionStart === selectionEnd) return;
    
    // Check if there are overlapping annotations
    const isOverlapping = annotations.some(annotation => 
      (selectionStart <= annotation.end && selectionEnd >= annotation.start)
    );
    
    if (isOverlapping) {
      alert('Annotations cannot overlap');
      return;
    }
    
    const newAnnotation = {
      start: selectionStart,
      end: selectionEnd,
      text: text.substring(selectionStart, selectionEnd),
      category: currentCategory
    };
    
    setAnnotations([...annotations, newAnnotation]);
    
    // Clear selection
    window.getSelection()?.removeAllRanges();
  };
  
  const removeAnnotation = (index: number) => {
    const newAnnotations = [...annotations];
    newAnnotations.splice(index, 1);
    setAnnotations(newAnnotations);
  };
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Person': '#FF5733',
      'Organization': '#33FF57',
      'Location': '#3357FF',
      'Date': '#F033FF',
      'Product': '#33FFF0',
      'Price': '#FFF033',
      'Other': '#FF33A8'
    };
    
    return colors[category] || '#FF5733';
  };
  
  const getTextWithHighlights = () => {
    // Sort annotations by start position
    const sortedAnnotations = [...annotations].sort((a, b) => a.start - b.start);
    
    let result = [];
    let lastEnd = 0;
    
    for (const annotation of sortedAnnotations) {
      // Add text before this annotation
      if (annotation.start > lastEnd) {
        result.push(text.substring(lastEnd, annotation.start));
      }
      
      // Add highlighted annotation
      result.push(
        <span 
          key={`${annotation.start}-${annotation.end}`}
          style={{ 
            backgroundColor: getCategoryColor(annotation.category),
            padding: '0 2px',
            borderRadius: '2px',
            color: '#fff'
          }}
        >
          {text.substring(annotation.start, annotation.end)}
        </span>
      );
      
      lastEnd = annotation.end;
    }
    
    // Add remaining text
    if (lastEnd < text.length) {
      result.push(text.substring(lastEnd));
    }
    
    return result;
  };
  
  const handleSubmit = () => {
    if (annotations.length === 0) return;
    
    onSubmit({
      annotations,
      text
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Text Content</h3>
            <div 
              id="text-content"
              className="min-h-[200px] text-lg leading-relaxed"
              onMouseUp={handleTextSelect}
            >
              {getTextWithHighlights()}
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Select category for annotation:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category: string) => (
                <Button
                  key={category}
                  size="sm"
                  variant={currentCategory === category ? "default" : "outline"}
                  onClick={() => setCurrentCategory(category)}
                  style={{ 
                    backgroundColor: currentCategory === category ? getCategoryColor(category) : 'transparent',
                    borderColor: getCategoryColor(category),
                    color: currentCategory === category ? '#fff' : getCategoryColor(category)
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="flex mt-4">
              <Button
                onClick={addAnnotation}
                disabled={selectionStart === selectionEnd}
                className="w-full"
              >
                Add Annotation
              </Button>
            </div>
            
            <div className="bg-muted/30 p-2 rounded-md mt-4">
              <p className="text-xs text-muted-foreground">
                <HelpCircle className="h-3 w-3 inline-block mr-1" />
                Select text, choose a category, then click "Add Annotation" to mark entities in the text.
              </p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="border rounded-md p-4 h-full">
            <h3 className="font-medium mb-2">Annotations ({annotations.length})</h3>
            
            {annotations.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No annotations added yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                {annotations.map((annotation, index) => (
                  <div key={index} className="border rounded-md p-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        style={{ 
                          backgroundColor: getCategoryColor(annotation.category),
                        }}
                      >
                        {annotation.category}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeAnnotation(index)}
                        className="h-6 w-6 p-0"
                      >
                        &times;
                      </Button>
                    </div>
                    <p className="text-sm mt-1 font-medium">"{annotation.text}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
        >
          Skip
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={annotations.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export function TaskInterface() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) {
        setError('Project ID is missing');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);

        console.log(`Fetching tasks for project ID: ${projectId}`);
        const response = await fetch(`/api/labeler/tasks?projectId=${projectId}`);
        
        // Log response status for debugging
        console.log(`Tasks API response status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Tasks API response data:', {
          success: data.success,
          projectFound: !!data.project,
          tasksCount: data.tasks?.length || 0
        });
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch tasks');
        }
        
        if (!data.project) {
          throw new Error('Project not found or not accessible');
        }
        
        setProject(data.project);
        
        if (!data.tasks || data.tasks.length === 0) {
          console.log('No tasks returned from API, will show empty state');
        } else {
          console.log(`Received ${data.tasks.length} tasks from API`);
        }
        
        setTasks(data.tasks || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError((error as Error).message || 'Failed to load tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [projectId]);
  
  const handleSubmitTask = async (result: any) => {
    if (!tasks[currentTaskIndex]) return;
    
    setIsSubmitting(true);
    setSuccessMessage(null);
    
    try {
      const taskId = tasks[currentTaskIndex].id;
      
      const response = await fetch('/api/labeler/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskId,
          result
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit task');
      }
      
      // Show success message with payment amount
      setSuccessMessage('Task submitted successfully!');
      setPaymentAmount(data.payment.amount);
      setTasksCompleted(prev => prev + 1);
      
      // Move to next task after short delay
      setTimeout(() => {
        if (currentTaskIndex < tasks.length - 1) {
          setCurrentTaskIndex(currentTaskIndex + 1);
          setSuccessMessage(null);
        } else {
          // All tasks completed
          setSuccessMessage('All tasks completed! Great job!');
        }
      }, 2000);
    } catch (error) {
      console.error('Error submitting task:', error);
      setError((error as Error).message || 'Failed to submit task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderTaskInterface = () => {
    if (!tasks || tasks.length === 0) {
      return (
        <div className="p-8 text-center bg-muted/20 rounded-md border border-muted">
          <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No tasks available</h3>
          <p className="text-muted-foreground mb-4">
            There are no tasks assigned to you for this project yet. This could be because:
          </p>
          <ul className="text-sm text-muted-foreground text-left max-w-md mx-auto space-y-2 mb-6">
            <li>• The project has no sample files uploaded</li>
            <li>• All available tasks are already assigned to other labelers</li>
            <li>• There was an error creating tasks for you</li>
          </ul>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Tasks
          </Button>
        </div>
      );
    }
    
    if (!tasks[currentTaskIndex]) {
      return (
        <div className="p-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-md border border-yellow-500/20">
          <p className="text-yellow-700 dark:text-yellow-300 text-center">
            Task #{currentTaskIndex+1} is not available. Please try refreshing the page.
          </p>
        </div>
      );
    }
    
    const task = tasks[currentTaskIndex];
    const projectType = project?.type;
    
    // Log task data for debugging
    console.log('Rendering task:', { taskId: task.id, type: projectType, taskData: task.taskData });
    
    switch (projectType) {
      case 'image-classification':
        return (
          <ImageClassificationTask 
            task={task} 
            onSubmit={handleSubmitTask}
            isSubmitting={isSubmitting}
          />
        );
      case 'object-detection':
        return (
          <ObjectDetectionTask 
            task={task} 
            onSubmit={handleSubmitTask}
            isSubmitting={isSubmitting}
          />
        );
      case 'text-annotation':
        return (
          <TextAnnotationTask 
            task={task} 
            onSubmit={handleSubmitTask}
            isSubmitting={isSubmitting}
          />
        );
      default:
        // Fallback to image classification if type not supported
        if (task.fileUrl) {
          console.log(`Project type "${projectType}" not directly supported, falling back to image classification`);
          return (
            <>
              <div className="p-3 bg-yellow-100/50 dark:bg-yellow-900/20 mb-4 rounded-md border border-yellow-500/20">
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  Project type "{projectType}" is using a generic labeling interface.
                </p>
              </div>
              <ImageClassificationTask 
                task={task} 
                onSubmit={handleSubmitTask}
                isSubmitting={isSubmitting}
              />
            </>
          );
        }
        
        return (
          <div className="p-4 bg-destructive/10 rounded-md border border-destructive/20">
            <p className="text-destructive">Task type not supported: {projectType}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please contact support for assistance with this project type.
            </p>
          </div>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto border-destructive/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Error</CardTitle>
            </div>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pb-6">
            <Button asChild>
              <Link href="/labeler/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Link href="/labeler/dashboard" className="text-primary flex items-center mb-2 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">{project?.name}</h1>
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="capitalize">
              {project?.type.replace(/-/g, ' ')}
            </Badge>
            <span className="text-sm text-muted-foreground ml-2">
              ${(0.10).toFixed(2)} per task
            </span>
          </div>
        </div>
        
        <div className="flex flex-col md:items-end space-y-2">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">Tasks Completed:</div>
            <div className="font-medium">{tasksCompleted} of {tasks.length}</div>
          </div>
          <Progress value={(tasksCompleted / tasks.length) * 100} className="w-full md:w-40 h-2" />
        </div>
      </div>
      
      <Collapsible
        open={isInstructionsOpen}
        onOpenChange={setIsInstructionsOpen}
        className="mb-6"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-base md:text-lg">
                <Info className="mr-2 h-5 w-5" />
                Project Instructions
              </CardTitle>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isInstructionsOpen ? 'Hide' : 'Show'}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-2">
              <p className="text-sm md:text-base">{project?.instructions}</p>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      {successMessage && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 p-4 rounded-md flex items-center">
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
          <div>
            <p className="font-medium">{successMessage}</p>
            {paymentAmount !== null && (
              <p className="text-sm mt-1 flex items-center">
                <CircleDollarSign className="h-4 w-4 mr-1 text-green-500" />
                Received payment: ${paymentAmount.toFixed(2)} USDC
                <span className="ml-1 text-xs text-muted-foreground">(transaction sent to your wallet)</span>
              </p>
            )}
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <span>Task {currentTaskIndex + 1} of {tasks.length}</span>
            {tasks[currentTaskIndex]?.taskData?.difficulty && (
              <Badge className="ml-2">{tasks[currentTaskIndex].taskData.difficulty}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderTaskInterface()}
        </CardContent>
      </Card>
    </div>
  );
}
