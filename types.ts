// This file contains TypeScript types and interfaces used throughout the application.

export type UUID = string;

export interface User {
    id: UUID;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export type UserRole = 'Super Admin' | 'Company Owner' | 'Marketing Manager' | 'Sales Manager' | 'Sales Executive' | 'Support Executive' | 'Customer' | 'Read-only User';

export interface Lead {
    id: UUID;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: LeadStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Converted';

export interface Company {
    id: UUID;
    name: string;
    address: string;
    phone: string;
    website: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Campaign {
    id: UUID;
    name: string;
    type: CampaignType;
    startDate: Date;
    endDate: Date;
    budget: number;
    createdAt: Date;
    updatedAt: Date;
}

export type CampaignType = 'Email' | 'Social Media' | 'SEO' | 'PPC';

export interface Report {
    id: UUID;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Analytics {
    totalLeads: number;
    totalConversions: number;
    revenue: number;
    marketingROI: number;
}

export interface BusinessAnalysis {
    seoScore: number;
    businessHealthScore: number;
    marketingScore: number;
    trustScore: number;
    growthScore: number;
    leadQualityScore: number;
    aiOpportunityScore: number;
}