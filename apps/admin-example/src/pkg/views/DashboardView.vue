<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { apiClient } from "../api/apiClient";

import Chart from "primevue/chart";
import { AppBtn } from "@devkitvue/base-components";
import { ColumnText, DataList, type DatalistProps } from "@devkitvue/datalist";
import type {
  PageListRequest,
  TenantsSchemaPage,
} from "@buf/ahmeddarwish_devkit-api.bufbuild_es/devkit/v1/tenant_page_pb";
import { ColumnImage } from "@devkitvue/datalist";
/**
 * Strips any field starting with "$"
 * Recurses into nested objects/arrays.
 */
function cleanMessage<T>(msg: T): any {
  if (msg == null || typeof msg !== "object") return msg;
  if (Array.isArray(msg)) return msg.map(cleanMessage);
  return Object.fromEntries(
    Object.entries(msg)
      .filter(([key]) => !key.startsWith("$"))
      .map(([key, val]) => [key, cleanMessage(val)]),
  );
}
const {
  counts: rawCounts,
  pages,
  partialByType,
} = await apiClient.tenantDashboard({});
const kpis = computed(() => (rawCounts ? cleanMessage(rawCounts) : {}));
const partials = computed(() =>
  partialByType ? cleanMessage(partialByType) : {},
);

const tableProps: DatalistProps<
  typeof apiClient,
  PageListRequest,
  TenantsSchemaPage,
  undefined,
  undefined,
  undefined
> = {
  context: {
    datalistKey: "tenants-page",
    rowIdentifier: "pageId",
    datatableProps: {
      scrollHeight: "300px",
    },
    columns: {
      pageId: new ColumnText("pageId"),
      pageName: new ColumnText("pageName"),
      pageMetaDescription: new ColumnText("pageMetaDescription"),
      pageKeyWords: new ColumnText("pageKeyWords"),
      pageBreadcrumb: new ColumnText("pageBreadcrumb"),
      pageCoverImage: new ColumnImage("pageCoverImage"),
    },
    records: pages!,
    viewRouter: {
      name: "page_find",
      paramName: "id",
      paramColumnName: "pageId",
    },
    isActionsDropdown: true,
    isLazyFilters: true,
    options: {
      title: "pages",
      description: "pages_desc",
    },
  },
};

const barData = computed(() =>
  (partialByType ?? []).map((x) => ({
    name: x.partialTypeName,
    count: x.partialCount,
  })),
);

const chartData = ref();
const chartOptions = ref();

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
const setChartData = () => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: ["A", "B", "C"],
    datasets: [
      {
        data: [540, 325, 702],
        backgroundColor: [
          documentStyle.getPropertyValue("--p-cyan-500"),
          documentStyle.getPropertyValue("--p-orange-500"),
          documentStyle.getPropertyValue("--p-gray-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--p-cyan-400"),
          documentStyle.getPropertyValue("--p-orange-400"),
          documentStyle.getPropertyValue("--p-gray-400"),
        ],
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  };
};
const iconsMap = {
  roleCount: "award-line",
  userCount: "user-line",
  tenantCount: "building-line",
  sectionCount: "file-line",
};
</script>

<template>
  <div class="space-y-6">
    <!-- KPI row -->
    <div v-if="kpis" class="grid gap-4 lg:grid-cols-4">
      <AppBtn
        class="glass rounded p-4 hover:none"
        v-for="(val, key) in kpis"
        :key="String(key)"
        :action="val.link"
      >
        <template #label>
          <div class="flex flex-col gap-2 items-center justify-center">
            <h3 class="bold text-2xl">{{ $t(String(key)) }}</h3>
            <h2 class="bold text-4xl">{{ val.count }}</h2>
          </div>
        </template>
        <template #icon>
          <div class="w-14 h-14">
            <AppIcon class="custom-icon" :icon="iconsMap[String(key)]" />
          </div>
        </template>
      </AppBtn>
    </div>

    <div v-if="partials" class="grid gap-4 lg:grid-cols-5">
      <AppBtn
        class="glass hover:none rounded p-4"
        v-for="(val, key) in partials"
        :key="String(key)"
        :route="{
          name: 'user_list',
          query: {
            'tenants-partial-filters-form': JSON.stringify({
              partialTypeId: val.partialTypeId,
            }),
          },
        }"
      >
        <template #label>
          <div class="flex flex-col gap-2 items-center justify-center">
            <h3 class="bold text-2xl">{{ $t(val.partialTypeName) }}</h3>
            <h2 class="bold text-4xl">{{ val.partialCount }}</h2>
          </div>
        </template>
      </AppBtn>
    </div>
    <div class="flex flex-wrap lg:flex-nowrap">
      <div
        class="glass p-4 flex-grow lg:flex-grow-0 mb-2 lg:mb-0 lg:w-1/3 mr-4 flex items-center rounded"
      >
        <Chart
          type="pie"
          :data="chartData"
          :options="chartOptions"
          class="w-full"
        />
      </div>

      <div class="glass p-4 lg:w-2/3 rounded">
        <DataList v-bind="tableProps">
          <template #title>
            <h2 class="text-bold text-2xl bold font-bold">{{ $t("pages") }}</h2>
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>
