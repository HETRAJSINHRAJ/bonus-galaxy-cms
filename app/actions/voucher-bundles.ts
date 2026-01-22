'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getVoucherBundles() {
  try {
    const bundles = await prisma.voucherBundle.findMany({
      orderBy: [
        { isPopular: 'desc' },
        { displayOrder: 'asc' },
      ],
    });
    return { success: true, bundles };
  } catch (error) {
    console.error('Error fetching bundles:', error);
    return { success: false, error: 'Failed to fetch bundles' };
  }
}

export async function createVoucherBundle(data: {
  name: string;
  description: string;
  price: number;
  value: number;
  pointsCost: number;
  voucherCount: number;
  paymentMethod: string;
  features: string[];
  isPopular: boolean;
  displayOrder: number;
}) {
  try {
    const bundle = await prisma.voucherBundle.create({
      data: {
        ...data,
        isActive: true,
      },
    });
    revalidatePath('/shops');
    return { success: true, bundle };
  } catch (error) {
    console.error('Error creating bundle:', error);
    return { success: false, error: 'Failed to create bundle' };
  }
}

export async function updateVoucherBundle(
  id: string,
  data: {
    name: string;
    description: string;
    price: number;
    value: number;
    pointsCost: number;
    voucherCount: number;
    paymentMethod: string;
    features: string[];
    isPopular: boolean;
    displayOrder: number;
  }
) {
  try {
    const bundle = await prisma.voucherBundle.update({
      where: { id },
      data,
    });
    revalidatePath('/shops');
    return { success: true, bundle };
  } catch (error) {
    console.error('Error updating bundle:', error);
    return { success: false, error: 'Failed to update bundle' };
  }
}

export async function deleteVoucherBundle(id: string) {
  try {
    await prisma.voucherBundle.delete({
      where: { id },
    });
    revalidatePath('/shops');
    return { success: true };
  } catch (error) {
    console.error('Error deleting bundle:', error);
    return { success: false, error: 'Failed to delete bundle' };
  }
}

export async function toggleVoucherBundleActive(id: string, isActive: boolean) {
  try {
    const bundle = await prisma.voucherBundle.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath('/shops');
    return { success: true, bundle };
  } catch (error) {
    console.error('Error toggling bundle status:', error);
    return { success: false, error: 'Failed to toggle bundle status' };
  }
}
