
import { IntranetLayout } from "@/components/layout/IntranetLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const Products = () => {
  return (
    <IntranetLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Explore SecureKloud's products and solutions</p>
        </div>
        
        <Tabs defaultValue="cloud">
          <TabsList className="grid w-full grid-cols-4 max-w-[600px]">
            <TabsTrigger value="cloud">Cloud Solutions</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="data">Data Services</TabsTrigger>
            <TabsTrigger value="managed">Managed Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cloud" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cloud Solutions</CardTitle>
                <CardDescription>Our comprehensive cloud transformation services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProductCard 
                    title="Cloud Migration" 
                    description="Seamlessly migrate your infrastructure to the cloud with our expert services."
                  />
                  <ProductCard 
                    title="Cloud Security" 
                    description="Protect your cloud environment with advanced security solutions."
                  />
                  <ProductCard 
                    title="Cloud Optimization" 
                    description="Optimize your cloud resources for maximum efficiency and cost savings."
                  />
                  <ProductCard 
                    title="Multi-Cloud Management" 
                    description="Unified management of your multi-cloud environment."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Solutions</CardTitle>
                <CardDescription>Protect your organization with our security offerings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProductCard 
                    title="Threat Detection" 
                    description="Advanced threat detection and response solutions."
                  />
                  <ProductCard 
                    title="Compliance Management" 
                    description="Ensure compliance with regulatory requirements."
                  />
                  <ProductCard 
                    title="Identity Management" 
                    description="Secure identity and access management solutions."
                  />
                  <ProductCard 
                    title="Security Operations" 
                    description="24/7 security monitoring and operations."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Services</CardTitle>
                <CardDescription>Unlock the power of your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProductCard 
                    title="Data Analytics" 
                    description="Extract meaningful insights from your data."
                  />
                  <ProductCard 
                    title="Data Warehouse" 
                    description="Store and manage your data efficiently."
                  />
                  <ProductCard 
                    title="Business Intelligence" 
                    description="Make data-driven business decisions."
                  />
                  <ProductCard 
                    title="AI & Machine Learning" 
                    description="Leverage AI and ML for predictive analytics."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="managed" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Managed Services</CardTitle>
                <CardDescription>Let us handle your IT operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProductCard 
                    title="Managed Infrastructure" 
                    description="End-to-end management of your IT infrastructure."
                  />
                  <ProductCard 
                    title="DevOps as a Service" 
                    description="Streamline your software development lifecycle."
                  />
                  <ProductCard 
                    title="Managed Security" 
                    description="Comprehensive security management services."
                  />
                  <ProductCard 
                    title="IT Help Desk" 
                    description="24/7 support for your organization."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </IntranetLayout>
  );
};

interface ProductCardProps {
  title: string;
  description: string;
}

const ProductCard = ({ title, description }: ProductCardProps) => {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-10 w-10 rounded-full bg-securekloud-100 flex items-center justify-center">
          <ShoppingBag className="h-5 w-5 text-securekloud-700" />
        </div>
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button size="sm" variant="outline">Learn More</Button>
    </div>
  );
};

export default Products;
