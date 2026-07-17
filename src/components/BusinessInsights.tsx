
'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const salesData = [
  { name: 'Jan', sales: 400000 },
  { name: 'Feb', sales: 300000 },
  { name: 'Mar', sales: 500000 },
  { name: 'Apr', sales: 450000 },
  { name: 'May', sales: 600000 },
  { name: 'Jun', sales: 550000 },
];

export function BusinessInsights() {
  const { t } = useTranslation();

  const translatedSalesData = useMemo(() => salesData.map(d => ({ ...d, name: t(d.name) })), [t]);

  return (
    <div className="space-y-8 mt-12">
        <h2 className="text-3xl font-bold font-headline">{t('Business Insights')}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Total Revenue')}</CardTitle>
            <span className="text-muted-foreground font-bold">₹</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,52,318.90</div>
            <p className="text-xs text-muted-foreground">+20.1% {t('from last month')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Orders')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% {t('from last month')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('Top Product')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t('Pashmina Shawl')}</div>
            <p className="text-xs text-muted-foreground">{t('Most sold item this month')}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('Sales Overview')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={translatedSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="₹"/>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="sales" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
