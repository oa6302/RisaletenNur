```tsx
'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import type { Article } from '@/lib/placeholder-data';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { useLiveCollection as useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/* =========================================================
   SABİT / STATİK MAHALL-İ HAKİKAT İÇERİĞİ
========================================================= */

const mahalliHakikatManifesto: Article = {
  id: 'static-mahalli-hakikat-manifesto',

  title: 'MAHALL-İ HAKİKAT: HAKİKAT GÜNEŞİ TULU EDİYOR',

  prompt:
    'Her şeyin bir yeri vardır. Bir şeyin hakikatı, kendi mahallinde ve vazifesinde tezahür eder. Yanlış mahalde gösterilen bir vasıf, ne kadar iyi olursa olsun, ya maksadın hilafına netice verir ya da fıtrata uygunsuz düşer.',

  content: JSON.stringify([
    {
      no: '01',
      badge: 'HAKİKAT',
      title: '⚖️ MESELE: TAHRİBAT VE FITRAT',

      problem:
        'Şu asırda dinsizlik ve tahribatın fazlalaşması, her şeyin mahallinden çıkmasına ve fıtrata uygunsuz düşmesine sebep oldu. Bu durum ruhlarda derin bir boşluk açtı.',

      hikmet:
        'Bir vasıf, mahallinde olsa kıymetlidir; mahalli haricinde olsa, ne kadar kıymetli olsa da kıymeti kalmaz.',

      hikmetKaynak: 'Sözler',

      ayet:
        'Şüphe yok ki namaz, mü’minler üzerine vakitleri belli bir farzdır.',

      ayetKaynak: 'Nisâ, 4/103',

      maddeler: [
        {
          simge: '🧭',
          etiket: 'BİLMELİ',
          aciklama:
            'Hakikat, ancak kendi mahallinde tezahür eder; yanlış yerdeki meziyet bile zarar verebilir.',
        },
        {
          simge: '🚀',
          etiket: 'YAŞAMALI',
          aciklama:
            'Kabiliyetlerini fıtratın çizdiği meşru dairede ve doğru mahalde kullanmalı.',
        },
        {
          simge: '💎',
          etiket: 'AKSETTİRMELİ',
          aciklama:
            'Bu nizamı koruyarak asrın manevi tahribatına karşı bir kale gibi durmalı.',
        },
      ],
    },

    {
      no: '02',
      badge: 'HAKİKAT',
      title: '✨ ŞUUR: BİLMEK NEDEN YETMEZ?',

      problem:
        'Bilgi, davranışa dönüşmediğinde mahallinde tezahür etmemiş olur. Hakikat, ancak yaşandığında bir şuur halini alır ve meyve verir.',

      hikmet:
        'İlim, insanın kendi fıtratını ve sınırlarını bilerek yaratılış gayesine ve mahalli vazifesine yönelmesidir.',

      hikmetKaynak: 'Risale-i Nur',

      ayet:
        'Ey iman edenler! Yapmayacağınız şeyi niçin söylüyorsunuz?',

      ayetKaynak: 'Saff, 61/2',

      maddeler: [
        {
          simge: '🔍',
          etiket: 'TEŞHİS ET',
          aciklama:
            'Kendi fıtrî mahallini ve vazifesini öğrenmeli; bu şuurla hareket etmeli.',
        },
        {
          simge: '🏗️',
          etiket: 'İNŞA ET',
          aciklama:
            'Öğrendiği hakikati günlük hayatında canlı birer davranışa dönüştürmeli.',
        },
        {
          simge: '🌟',
          etiket: 'YANSIT',
          aciklama:
            'Güzellikleri sözle anlatmakla yetinmemeli; fiilleriyle çevresine bir güneş gibi tulû etmeli.',
        },
      ],
    },

    {
      no: '03',
      badge: 'HAKİKAT',
      title: '☀️ EL-EMEL: HAKİKAT GÜNEŞİ TULU EDİYOR',

      problem:
        'Tahribat ne kadar büyük olursa olsun, mazlum ve mâsum ehl-i imanın yüzü gülecek. En büyük düşman olan yeise karşı parlak bir hakikat güneşi doğuyor.',

      hikmet:
        'Ümitvar olunuz! Şu istikbal inkılâbı içinde en yüksek gür sadâ, İslâm’ın sadâsı olacaktır. Yeis mâni-i herkemâldir.',

      hikmetKaynak: 'Mektubat',

      ayet: 'Allah’ın rahmetinden ümit kesmeyin.',

      ayetKaynak: 'Zümer, 39/53',

      maddeler: [
        {
          simge: '🌈',
          etiket: 'ÜMİT ETMELİ',
          aciklama:
            'Geleceğin o parlak hakikat güneşinin tulû edeceğine sarsılmaz bir imanla inanmalı.',
        },
        {
          simge: '🕊️',
          etiket: 'GAYRET ETMELİ',
          aciklama:
            'Ümidini duaya ve tahribatı tamir edecek yüksek bir hamiyete dönüştürmeli.',
        },
        {
          simge: '🔆',
          etiket: 'YENİDEN BAŞLA',
          aciklama:
            'Karanlığa küfretmek yerine, hakikat güneşinden aldığı nurla kendi kandilini yakmalı.',
        },
      ],
    },

    {
      no: '04',
      badge: 'HAKİKAT',
      title: '🛡️ İRADE: KENDİNİ YÖNETME SANATI',

      problem:
        'İrade, fıtratın rayından çıkan kabiliyetleri tekrar hakikat merkezine ve asli mahalline çekme sanatıdır.',

      hikmet:
        'Kuvvet, hakta ve ihlâstadır. İhlas ise amellerin tam mahalli ve vazifesinde yapılmasıyla mümkündür.',

      hikmetKaynak: "Lem'alar",

      ayet:
        'Kim nefsinin cimriliğinden korunursa, işte onlar kurtuluşa erenlerdir.',

      ayetKaynak: 'Haşr, 59/9',

      maddeler: [
        {
          simge: '🧭',
          etiket: 'BİLMELİ',
          aciklama:
            'Nefsin her isteği fıtrata uygun değildir; irade ile mahal tayini yapılmalıdır.',
        },
        {
          simge: '⚔️',
          etiket: 'SEÇMELİ',
          aciklama:
            'Tahribata hizmet eden geçici zevkler yerine, tamire hizmet eden ebedi hakikatleri seçmeli.',
        },
        {
          simge: '🧱',
          etiket: 'DİSİPLİN',
          aciklama:
            'Vaktini ve dikkatini hakikat güneşinin tuluuna hazırlanacak şekilde yönetmeli.',
        },
      ],
    },

    {
      no: '05',
      badge: 'HAKİKAT',
      title: '💎 İHLÂS: YAPTIĞIN ŞEY KİMİN İÇİN?',

      problem:
        'Amelin ruhu ihlastır. İhlas ise vazifenin sadece Rıza-yı İlahi için, tam mahallinde ve vaktinde ifa edilmesidir.',

      hikmet:
        'Amellerde ihlâs temel esastır. Eğer O razı olsa, bütün dünya küsse ehemmiyeti yoktur.',

      hikmetKaynak: 'Şualar',

      ayet:
        'Halbuki onlara ancak, dini Allah’a has kılarak O’na kulluk etmeleri emredilmişti.',

      ayetKaynak: 'Beyyine, 98/5',

      maddeler: [
        {
          simge: '🧼',
          etiket: 'NİYET ET',
          aciklama:
            'Yaptığı her tamirat ve hizmetin merkezine sadece İlahî rızayı koymalı.',
        },
        {
          simge: '🤫',
          etiket: 'SAMİMİ OL',
          aciklama:
            'Asrın gösteriş ve riya tahribatına karşı ihlas zırhıyla korunmalı.',
        },
        {
          simge: '♾️',
          etiket: 'DEVAM ET',
          aciklama:
            'Takdir edilse de edilmese de hakikat güneşinin bir neferi olarak vazifesine devam etmeli.',
        },
      ],
    },
  ]),

  source: 'Risale-i Nur Külliyatı, Sözler',

  cardStyle: 1,

  categories: ['İMAN', 'VECİZELER'],

  topics: ['Fıtrat', 'Ümit', 'İhlas', 'İrade'],

  tags: ['hakikat', 'mahall', 'ümit', 'irade', 'ihlas', 'tulu'],

  status: 'published',

  createdAt: new Date('2025-02-21T09:00:00Z'),

  updatedAt: new Date('2025-02-21T09:00:00Z'),

  ottoman_font_family: 'Rika',

  ottoman_font_size: 36,

  content_font_size: 24,

  ottoman_font_color: '#0f172a',
};

/* =========================================================
   CONTEXT TİPLERİ
========================================================= */

type ArticleContextType = {
  articles: Article[];

  addArticle: (
    article: Omit<Article, 'id' | 'createdAt'>
  ) => void;

  updateArticle: (
    article: Partial<Article> & { id: string }
  ) => void;

  deleteArticle: (id: string) => void;

  isLoading: boolean;
};

/* =========================================================
   CONTEXT
========================================================= */

const ArticleContext =
  createContext<ArticleContextType | undefined>(undefined);

/* =========================================================
   PROVIDER
========================================================= */

export function ArticleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const firestore = useFirestore();

  /* -------------------------------------------------------
     ARTICLES COLLECTION
  ------------------------------------------------------- */

  const articlesCollection = useMemoFirebase(() => {
    if (!firestore) return null;

    return collection(firestore, 'articles');
  }, [firestore]);

  /* -------------------------------------------------------
     FIRESTORE LIVE COLLECTION
  ------------------------------------------------------- */

  const {
    data: articlesFromDb,
    isLoading,
  } = useCollection(articlesCollection);

  /* -------------------------------------------------------
     ARTICLES
     
     Firestore verileri + statik manifesto
  ------------------------------------------------------- */

  const articles = useMemo<Article[]>(() => {
    const firestoreArticles: Article[] =
      (articlesFromDb ?? []).map(
        (item) => ({ ...item } as Article)
      );

    const hasStaticManifesto = firestoreArticles.some(
      (article) =>
        article.id === mahalliHakikatManifesto.id
    );

    if (hasStaticManifesto) {
      return firestoreArticles;
    }

    return [
      mahalliHakikatManifesto,
      ...firestoreArticles,
    ];
  }, [articlesFromDb]);

  /* =======================================================
     ADD ARTICLE
  ======================================================= */

  const addArticle = useCallback(
    (articleData: Omit<Article, 'id' | 'createdAt'>) => {
      if (!firestore) {
        console.error(
          'Firestore henüz hazır değil.'
        );
        return;
      }

      const articlesRef = collection(
        firestore,
        'articles'
      );

      const dataToSave = {
        ...articleData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      addDoc(articlesRef, dataToSave).catch(
        (serverError) => {
          const permissionError =
            new FirestorePermissionError({
              path: articlesRef.path,
              operation: 'create',
              requestResourceData: dataToSave,
            });

          console.error(
            'Makale eklenirken hata oluştu:',
            serverError
          );

          errorEmitter.emit(
            'permission-error',
            permissionError
          );
        }
      );
    },
    [firestore]
  );

  /* =======================================================
     UPDATE ARTICLE
  ======================================================= */

  const updateArticle = useCallback(
    (
      updatedArticle: Partial<Article> & {
        id: string;
      }
    ) => {
      const articleId = updatedArticle.id;

      /*
       * Statik içerikler Firestore'dan değiştirilmez.
       */
      if (articleId.startsWith('static-')) {
        console.warn(
          `Statik makale güncellenemez: ${articleId}`
        );
        return;
      }

      if (!firestore) {
        console.error(
          'Firestore henüz hazır değil.'
        );
        return;
      }

      const articleRef = doc(
        firestore,
        'articles',
        articleId
      );

      /*
       * id alanını Firestore dokümanının içine tekrar
       * yazmamak için çıkarıyoruz.
       */
      const { id: _id, ...articleFields } =
        updatedArticle;

      const dataToSave = {
        ...articleFields,
        updatedAt: serverTimestamp(),
      };

      updateDoc(articleRef, dataToSave).catch(
        (serverError) => {
          const permissionError =
            new FirestorePermissionError({
              path: articleRef.path,
              operation: 'update',
              requestResourceData: dataToSave,
            });

          console.error(
            'Makale güncellenirken hata oluştu:',
            serverError
          );

          errorEmitter.emit(
            'permission-error',
            permissionError
          );
        }
      );
    },
    [firestore]
  );

  /* =======================================================
     DELETE ARTICLE
  ======================================================= */

  const deleteArticle = useCallback(
    (id: string) => {
      /*
       * Statik içerikler silinemez.
       */
      if (id.startsWith('static-')) {
        console.warn(
          `Statik makale silinemez: ${id}`
        );
        return;
      }

      if (!firestore) {
        console.error(
          'Firestore henüz hazır değil.'
        );
        return;
      }

      const articleRef = doc(
        firestore,
        'articles',
        id
      );

      deleteDoc(articleRef).catch(
        (serverError) => {
          const permissionError =
            new FirestorePermissionError({
              path: articleRef.path,
              operation: 'delete',
            });

          console.error(
            'Makale silinirken hata oluştu:',
            serverError
          );

          errorEmitter.emit(
            'permission-error',
            permissionError
          );
        }
      );
    },
    [firestore]
  );

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo<ArticleContextType>(
    () => ({
      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      isLoading,
    }),
    [
      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      isLoading,
    ]
  );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
}

/* =========================================================
   useArticles HOOK
========================================================= */

export function useArticles(): ArticleContextType {
  const context = useContext(ArticleContext);

  if (!context) {
    throw new Error(
      'useArticles must be used within an ArticleProvider'
    );
  }

  return context;
}
```
