import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReferenceModelViewer from "@/components/ReferenceModelViewer";
import SecurityLevelsViewer from "@/components/SecurityLevelsViewer";
import LifecycleViewer from "@/components/LifecycleViewer";
import { Layers, Shield, Zap } from "lucide-react";

interface CourseData {
  models: {
    referenceModel: { levels: Array<{ id: number; name: string; description: string; systems: string; color: string }> };
    securityLevels: { levels: Array<{ id: number; name: string; description: string; threat: string; color: string }> };
  };
}

interface ModelsPageProps {
  courseData: CourseData;
}

export default function ModelsPage({ courseData }: ModelsPageProps) {
  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">ISA/IEC 62443 Models</h1>
        <p className="text-lg text-muted-foreground">
          Interactive visualizations of the core architectural and security models
        </p>
      </div>

      <Tabs defaultValue="reference" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="reference" className="flex items-center gap-2">
            <Layers size={18} />
            <span className="hidden sm:inline">Reference Model</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield size={18} />
            <span className="hidden sm:inline">Security Levels</span>
          </TabsTrigger>
          <TabsTrigger value="lifecycle" className="flex items-center gap-2">
            <Zap size={18} />
            <span className="hidden sm:inline">Lifecycle</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reference" className="space-y-4">
          <ReferenceModelViewer levels={courseData.models.referenceModel.levels} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityLevelsViewer levels={courseData.models.securityLevels.levels} />
        </TabsContent>

        <TabsContent value="lifecycle" className="space-y-4">
          <LifecycleViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
