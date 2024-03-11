import { PRODUCTS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApi = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getProducts: builder.query({
			query: () => ({
				url: PRODUCTS_URL,
			}),
			providesTags: ['Product'],
			keepUnusedDataFor: 5,
		}),

		getProductDetail: builder.query({
			query: productId => ({
				url: `${PRODUCTS_URL}/${productId}`,
			}),
			providesTags: ['Product'],
			keepUnusedDataFor: 5,
		}),

		createProduct: builder.mutation({
			query: () => ({
				url: PRODUCTS_URL,
				method: 'POST',
			}),
			invalidatesTags: ['Product'],
		}),

		updateProduct: builder.mutation({
			query: data => ({
				url: `${PRODUCTS_URL}/${data.productId}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Product'],
		}),

		uploadProductImage: builder.mutation({
			query: data => ({
				url: `${UPLOAD_URL}`,
				method: 'POST',
				body: data,
			}),
		}),

		deleteProduct: builder.mutation({
			query: productId => ({
				url: `${PRODUCTS_URL}/${productId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Product'],
		}),
	}),
});

export const {
	useGetProductsQuery,
	useGetProductDetailQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useUploadProductImageMutation,
	useDeleteProductMutation,
} = productsApi;
